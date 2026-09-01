use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use rand::{rngs::OsRng, RngCore};
use serde::Deserialize;
use serde_json::{json, Value};
use std::{fs, path::Path};

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct StoredApp {
    id: String,
    name: String,
    enabled: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct StoredCorrection {
    id: String,
    before: String,
    after: String,
    heard: String,
    intended: String,
    app_id: String,
    source_name: Option<String>,
    created_at: String,
    status: String,
    hits: u64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct StoredSettings {
    theme: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct StoredState {
    version: u8,
    apps: Vec<StoredApp>,
    corrections: Vec<StoredCorrection>,
    settings: StoredSettings,
}

fn validate_state(state: &Value) -> Result<(), String> {
    let parsed: StoredState = serde_json::from_value(state.clone())
        .map_err(|_| "The repair book has invalid fields".to_string())?;
    if parsed.version != 1 || !matches!(parsed.settings.theme.as_str(), "system" | "light" | "dark")
    {
        return Err("The repair book has an unsupported version or theme".into());
    }
    if parsed
        .apps
        .iter()
        .any(|app| app.id.trim().is_empty() || app.name.trim().is_empty())
        || parsed.corrections.iter().any(|rule| {
            rule.id.trim().is_empty()
                || rule.heard.trim().is_empty()
                || rule.intended.trim().is_empty()
                || rule.app_id.trim().is_empty()
                || rule.created_at.trim().is_empty()
                || !matches!(rule.status.as_str(), "draft" | "approved")
                || rule
                    .source_name
                    .as_ref()
                    .is_some_and(|name| name.trim().is_empty())
        })
    {
        return Err("The repair book contains an incomplete record".into());
    }
    // Touch every persisted field so schema drift is caught by compiler warnings and review.
    let _ = parsed.apps.iter().filter(|app| app.enabled).count();
    let _ = parsed
        .corrections
        .iter()
        .map(|rule| rule.before.len() + rule.after.len() + rule.hits as usize)
        .sum::<usize>();
    Ok(())
}

fn key_bytes_in_dir(dir: &Path) -> Result<[u8; 32], String> {
    fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    let path = dir.join("vault.key");
    if path.exists() {
        let value = fs::read(path).map_err(|e| e.to_string())?;
        return value
            .try_into()
            .map_err(|_| "The vault key is damaged".to_string());
    }
    let mut key = [0_u8; 32];
    OsRng.fill_bytes(&mut key);
    fs::write(&path, key).map_err(|e| e.to_string())?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&path, fs::Permissions::from_mode(0o600)).map_err(|e| e.to_string())?;
    }
    Ok(key)
}

pub(crate) fn load_state_from_dir(dir: &Path) -> Result<Value, String> {
    let path = dir.join("repair-book.enc");
    if !path.exists() {
        return Ok(json!({"version":1,"apps":[],"corrections":[],"settings":{"theme":"system"}}));
    }
    let packet = STANDARD
        .decode(fs::read_to_string(path).map_err(|e| e.to_string())?)
        .map_err(|_| "The encrypted vault is unreadable".to_string())?;
    if packet.len() < 13 {
        return Err("The encrypted vault is incomplete".into());
    }
    let cipher = Aes256Gcm::new_from_slice(&key_bytes_in_dir(dir)?).map_err(|e| e.to_string())?;
    let clear = cipher
        .decrypt(Nonce::from_slice(&packet[..12]), &packet[12..])
        .map_err(|_| "The encrypted vault could not be unlocked".to_string())?;
    serde_json::from_slice(&clear).map_err(|e| e.to_string())
}

pub(crate) fn save_state_to_dir(dir: &Path, state: &Value) -> Result<(), String> {
    validate_state(state)?;
    let clear = serde_json::to_vec(state).map_err(|e| e.to_string())?;
    let mut nonce = [0_u8; 12];
    OsRng.fill_bytes(&mut nonce);
    let cipher = Aes256Gcm::new_from_slice(&key_bytes_in_dir(dir)?).map_err(|e| e.to_string())?;
    let encrypted = cipher
        .encrypt(Nonce::from_slice(&nonce), clear.as_ref())
        .map_err(|e| e.to_string())?;
    let mut packet = nonce.to_vec();
    packet.extend(encrypted);
    fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    let temp = dir.join("repair-book.tmp");
    fs::write(&temp, STANDARD.encode(packet)).map_err(|e| e.to_string())?;
    let destination = dir.join("repair-book.enc");
    #[cfg(windows)]
    if destination.exists() {
        fs::remove_file(&destination).map_err(|e| e.to_string())?;
    }
    fs::rename(temp, destination).map_err(|e| e.to_string())
}

pub(crate) fn erase_local_files(dir: &Path) -> Result<(), String> {
    for name in ["repair-book.enc", "repair-book.tmp", "vault.key"] {
        let path = dir.join(name);
        if path.exists() {
            fs::remove_file(path).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn isolated_dir(label: &str) -> PathBuf {
        let mut random = [0_u8; 8];
        OsRng.fill_bytes(&mut random);
        std::env::temp_dir().join(format!(
            "drb-{label}-{}-{}",
            std::process::id(),
            u64::from_le_bytes(random)
        ))
    }

    // @claim:encrypted-vault
    #[test]
    fn claim_encrypted_vault_uses_aes_256_gcm() {
        let root = isolated_dir("vault-test");
        let state = json!({
            "version": 1,
            "apps": [{"id":"clinical","name":"Clinical notes","enabled":true}],
            "corrections": [{"id":"metoprolol","before":"met a pro lol","after":"metoprolol","heard":"met a pro lol","intended":"metoprolol","appId":"clinical","sourceName":"Clinical notes","createdAt":"2026-08-29T00:00:00.000Z","status":"approved","hits":4}],
            "settings": {"theme":"dark"}
        });
        save_state_to_dir(&root, &state).unwrap();
        let encrypted = fs::read(root.join("repair-book.enc")).unwrap();
        assert!(!String::from_utf8_lossy(&encrypted).contains("metoprolol"));
        assert_eq!(load_state_from_dir(&root).unwrap(), state);
        fs::remove_dir_all(root).unwrap();
    }

    // @claim:per-device-key
    #[test]
    fn claim_per_device_key_is_random_and_private_on_unix() {
        let base = isolated_dir("key-test");
        let one = base.join("one");
        let two = base.join("two");
        let first = key_bytes_in_dir(&one).unwrap();
        let second = key_bytes_in_dir(&two).unwrap();
        assert_eq!(first.len(), 32);
        assert_eq!(second.len(), 32);
        assert_ne!(first, second);
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            assert_eq!(
                fs::metadata(one.join("vault.key"))
                    .unwrap()
                    .permissions()
                    .mode()
                    & 0o777,
                0o600
            );
        }
        fs::remove_dir_all(base).unwrap();
    }

    // @claim:native-erase
    #[test]
    fn claim_native_erase_removes_vault_and_key() {
        let dir = isolated_dir("erase-test");
        fs::create_dir_all(&dir).unwrap();
        for name in ["repair-book.enc", "repair-book.tmp", "vault.key"] {
            fs::write(dir.join(name), b"private fixture").unwrap();
        }
        erase_local_files(&dir).unwrap();
        assert!(fs::read_dir(&dir).unwrap().next().is_none());
        fs::remove_dir(dir).unwrap();
    }

    #[test]
    fn rejects_partially_shaped_state_before_encryption() {
        assert!(validate_state(&json!({"version":1,"corrections":[]})).is_err());
    }
}
