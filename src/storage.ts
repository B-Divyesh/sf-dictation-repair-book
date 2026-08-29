import { invoke } from '@tauri-apps/api/core';
import { emptyState, parseRepairState, type RepairState } from './types';

const key = 'drb_web_preview_state';
const demoKey = `demo:${key}`;

export const isNative = () => '__TAURI_INTERNALS__' in window;
export const isDemo = () => !isNative() && location.pathname.replace(/\/$/, '') === '/demo';

export const sampleState = (): RepairState => ({
  version: 1,
  apps: [
    { id: 'sample-clinical-notes', name: 'Clinical notes', enabled: true },
    { id: 'sample-engineering-notes', name: 'Engineering notes', enabled: true }
  ],
  corrections: [
    { id: 'sample-metoprolol', before: 'Continue met a pro lol at bedtime.', after: 'Continue metoprolol at bedtime.', heard: 'met a pro lol', intended: 'metoprolol', appId: 'sample-clinical-notes', sourceName: 'Clinical notes', createdAt: '2026-08-28T00:00:00.000Z', status: 'approved', hits: 4 },
    { id: 'sample-kubernetes', before: 'Deploy the cube or net ease service.', after: 'Deploy the Kubernetes service.', heard: 'cube or net ease', intended: 'Kubernetes', appId: 'sample-engineering-notes', sourceName: 'Engineering notes', createdAt: '2026-08-27T00:00:00.000Z', status: 'approved', hits: 7 },
    { id: 'sample-niamh', before: 'Ask Neem to review the handoff.', after: 'Ask Niamh to review the handoff.', heard: 'Neem', intended: 'Niamh', appId: 'sample-engineering-notes', sourceName: 'Engineering notes', createdAt: '2026-08-26T00:00:00.000Z', status: 'approved', hits: 2 }
  ],
  settings: { theme: 'system' }
});

const previewKey = () => isDemo() ? demoKey : key;

export async function loadState(): Promise<RepairState> {
  if (isNative()) return parseRepairState(await invoke<unknown>('load_state'));
  const raw = localStorage.getItem(previewKey());
  if (!raw) return isDemo() ? sampleState() : emptyState();
  try { return parseRepairState(JSON.parse(raw)); }
  catch {
    localStorage.removeItem(previewKey());
    throw new Error('Invalid stored repair book');
  }
}

export async function saveState(state: RepairState): Promise<void> {
  state = parseRepairState(state);
  if (isNative()) return invoke('save_state', { state });
  localStorage.setItem(previewKey(), JSON.stringify(state));
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
  localStorage.removeItem(previewKey());
}
