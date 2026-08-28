const repo = 'https://github.com/B-Divyesh/sf-dictation-repair-book';
const manifestUrl = `${repo}/releases/latest/download/latest.json`;
type Asset = { url: string; sha256: string; filename: string };
type Manifest = { version: string; platforms: Record<string, Asset> };

function platformKey(): string {
  const platform = ((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform).toLowerCase();
  const arm = /arm|aarch64/.test(navigator.userAgent.toLowerCase()) || /arm/.test(platform);
  if (/mac/.test(platform)) return arm ? 'macos-arm64' : 'macos-x64';
  if (/win/.test(platform)) return 'windows-x64';
  return 'linux-x64';
}

async function resolveDownload() {
  const button = document.querySelector<HTMLAnchorElement>('#platform-download')!;
  const note = document.querySelector<HTMLElement>('#platform-note')!;
  const status = document.querySelector<HTMLElement>('#release-status')!;
  const labels: Record<string, string> = { 'macos-arm64':'macOS (Apple silicon)', 'macos-x64':'macOS (Intel)', 'windows-x64':'Windows', 'linux-x64':'Linux AppImage' };
  const key = platformKey();
  try {
    const response = await fetch(manifestUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error();
    const manifest = await response.json() as Manifest;
    const asset = manifest.platforms[key];
    if (!asset?.url) throw new Error();
    button.href = asset.url;
    button.textContent = `Download for ${labels[key]}`;
    note.textContent = `${manifest.version} · checksum published · unsigned build`;
  } catch {
    button.href = `${repo}/releases/latest`;
    button.textContent = 'See available downloads';
    note.textContent = 'We could not detect the latest build.';
    status.hidden = false;
    status.textContent = navigator.onLine ? 'Release lookup is unavailable. Open the releases page to choose an installer.' : 'You appear offline. Reconnect to download; the product itself works offline.';
  }
}

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(button.dataset.copy!); button.textContent = 'Copied'; }
  catch { button.textContent = 'Select and copy the command'; }
}));

const restore = document.querySelector<HTMLFormElement>('#restore-form')!;
document.querySelector('#show-restore')?.addEventListener('click', () => { restore.hidden = !restore.hidden; if (!restore.hidden) restore.querySelector<HTMLInputElement>('input')?.focus(); });
restore.addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = restore.querySelector<HTMLInputElement>('#license')!.value.trim();
  const status = restore.querySelector<HTMLElement>('#license-status')!;
  localStorage.setItem('sb_license:dictation-repair-book', token);
  status.textContent = 'Checking license…';
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/dictation-repair-book/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: result.valid, reason: result.reason, checkedAt: Date.now() }));
    status.textContent = result.valid ? 'License saved. Open the desktop app to use unlimited rules.' : 'That license is not active for this product.';
  } catch { status.textContent = 'Could not verify while offline. The token is saved for the app to check later.'; }
});

window.addEventListener('offline', () => { const status = document.querySelector<HTMLElement>('#release-status')!; status.hidden = false; status.textContent = 'You are offline. Reconnect to download; the desktop repair book works offline.'; });
void resolveDownload();
if ('serviceWorker' in navigator && location.protocol === 'https:') void navigator.serviceWorker.register('/sw.js');
