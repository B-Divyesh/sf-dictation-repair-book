import { invoke } from '@tauri-apps/api/core';
import { emptyState, type RepairState } from './types';

const key = 'drb_web_preview_state';

export const isNative = () => '__TAURI_INTERNALS__' in window;

export async function loadState(): Promise<RepairState> {
  if (isNative()) return invoke<RepairState>('load_state');
  const raw = localStorage.getItem(key);
  if (!raw) return emptyState();
  try { return JSON.parse(raw) as RepairState; } catch { return emptyState(); }
}

export async function saveState(state: RepairState): Promise<void> {
  if (isNative()) return invoke('save_state', { state });
  localStorage.setItem(key, JSON.stringify(state));
}

export async function readClipboard(): Promise<string> {
  if (isNative()) return invoke<string>('read_clipboard_text');
  return navigator.clipboard.readText();
}

export async function writeClipboard(value: string): Promise<void> {
  if (isNative()) return invoke('write_clipboard_text', { value });
  return navigator.clipboard.writeText(value);
}

export async function eraseVault(): Promise<void> {
  if (isNative()) return invoke('erase_vault');
  localStorage.removeItem(key);
}
