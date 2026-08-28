use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use rand::{rngs::OsRng, RngCore};
use serde_json::{json, Value};
use std::{fs, path::PathBuf};
use tauri::{
    menu::{Menu, MenuItem},
    path::BaseDirectory,
    tray::TrayIconBuilder,
    AppHandle, Manager,
};

fn data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .resolve("vault", BaseDirectory::AppData)
        .map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn key_bytes(app: &AppHandle) -> Result<[u8; 32], String> {
    let path = data_dir(app)?.join("vault.key");
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

#[tauri::command]
fn load_state(app: AppHandle) -> Result<Value, String> {
    let path = data_dir(&app)?.join("repair-book.enc");
    if !path.exists() {
        return Ok(json!({"version":1,"apps":[],"corrections":[],"settings":{"theme":"system"}}));
    }
    let packet = STANDARD
        .decode(fs::read_to_string(path).map_err(|e| e.to_string())?)
        .map_err(|_| "The encrypted vault is unreadable".to_string())?;
    if packet.len() < 13 {
        return Err("The encrypted vault is incomplete".into());
    }
    let cipher = Aes256Gcm::new_from_slice(&key_bytes(&app)?).map_err(|e| e.to_string())?;
    let clear = cipher
        .decrypt(Nonce::from_slice(&packet[..12]), &packet[12..])
        .map_err(|_| "The encrypted vault could not be unlocked".to_string())?;
    serde_json::from_slice(&clear).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_state(app: AppHandle, state: Value) -> Result<(), String> {
    let clear = serde_json::to_vec(&state).map_err(|e| e.to_string())?;
    let mut nonce = [0_u8; 12];
    OsRng.fill_bytes(&mut nonce);
    let cipher = Aes256Gcm::new_from_slice(&key_bytes(&app)?).map_err(|e| e.to_string())?;
    let encrypted = cipher
        .encrypt(Nonce::from_slice(&nonce), clear.as_ref())
        .map_err(|e| e.to_string())?;
    let mut packet = nonce.to_vec();
    packet.extend(encrypted);
    let dir = data_dir(&app)?;
    let temp = dir.join("repair-book.tmp");
    fs::write(&temp, STANDARD.encode(packet)).map_err(|e| e.to_string())?;
    fs::rename(temp, dir.join("repair-book.enc")).map_err(|e| e.to_string())
}

#[tauri::command]
fn erase_vault(app: AppHandle) -> Result<(), String> {
    let dir = data_dir(&app)?;
    for name in ["repair-book.enc", "repair-book.tmp", "vault.key"] {
        let path = dir.join(name);
        if path.exists() {
            fs::remove_file(path).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

#[tauri::command]
fn read_clipboard_text() -> Result<String, String> {
    arboard::Clipboard::new()
        .and_then(|mut clipboard| clipboard.get_text())
        .map_err(|e| format!("Clipboard unavailable: {e}"))
}

#[tauri::command]
fn write_clipboard_text(value: String) -> Result<(), String> {
    arboard::Clipboard::new()
        .and_then(|mut clipboard| clipboard.set_text(value))
        .map_err(|e| format!("Clipboard unavailable: {e}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let open = MenuItem::with_id(app, "open", "Open repair book", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open, &quit])?;
            TrayIconBuilder::new()
                .menu(&menu)
                .tooltip("Dictation Repair Book")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .build(app)?;
            if let Some(window) = app.get_webview_window("main") {
                let hide_window = window.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = hide_window.hide();
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_state,
            save_state,
            erase_vault,
            read_clipboard_text,
            write_clipboard_text
        ])
        .run(tauri::generate_context!())
        .expect("error while running Dictation Repair Book");
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn aes_round_trip() {
        let key = [7_u8; 32];
        let nonce = [3_u8; 12];
        let cipher = Aes256Gcm::new_from_slice(&key).unwrap();
        let encrypted = cipher
            .encrypt(Nonce::from_slice(&nonce), b"private words".as_ref())
            .unwrap();
        assert_ne!(encrypted, b"private words");
        assert_eq!(
            cipher
                .decrypt(Nonce::from_slice(&nonce), encrypted.as_ref())
                .unwrap(),
            b"private words"
        );
    }
}
