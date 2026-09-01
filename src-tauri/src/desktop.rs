use crate::privacy::{erase_local_files, load_state_from_dir, save_state_to_dir};
use serde_json::Value;
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

#[tauri::command]
fn load_state(app: AppHandle) -> Result<Value, String> {
    load_state_from_dir(&data_dir(&app)?)
}

#[tauri::command]
fn save_state(app: AppHandle, state: Value) -> Result<(), String> {
    save_state_to_dir(&data_dir(&app)?, &state)
}

#[tauri::command]
fn erase_vault(app: AppHandle) -> Result<(), String> {
    erase_local_files(&data_dir(&app)?)
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
            let quit = MenuItem::with_id(app, "quit", "Quit repair book", true, None::<&str>)?;
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
