const repo = 'https://github.com/B-Divyesh/sf-dictation-repair-book';
if (new URLSearchParams(location.search).get('demo') === '1') location.replace('/demo/?demo=1');
const releaseApi = 'https://api.github.com/repos/B-Divyesh/sf-dictation-repair-book/releases/latest';
const releasePage = `${repo}/releases/latest`;
const releaseCacheKey = 'drb_release_metadata';
const releaseCacheAge = 60 * 60 * 1_000;
type Release = { tag_name: string; assets: { name: string; browser_download_url: string }[] };
type CachedRelease = { checkedAt: number; release: Release };

const filenames: Record<string, string> = {
  'macos-arm64': 'Dictation-Repair-Book-macos-arm64.dmg',
  'macos-x64': 'Dictation-Repair-Book-macos-x64.dmg',
  'windows-x64': 'Dictation-Repair-Book-windows-x64.msi',
  'linux-x64': 'Dictation-Repair-Book-linux-x64.AppImage'
};

function validRelease(value: unknown): value is Release {
  if (!value || typeof value !== 'object') return false;
  const release = value as Partial<Release>;
  return typeof release.tag_name === 'string' && Array.isArray(release.assets)
    && release.assets.every((asset) => typeof asset?.name === 'string' && typeof asset?.browser_download_url === 'string');
}

function cachedRelease(): Release | null {
  try {
    const cached = JSON.parse(localStorage.getItem(releaseCacheKey) || '{}') as Partial<CachedRelease>;
    return typeof cached.checkedAt === 'number' && Date.now() - cached.checkedAt < releaseCacheAge && validRelease(cached.release)
      ? cached.release
      : null;
  } catch { return null; }
}

function saveCachedRelease(release: Release) {
  try { localStorage.setItem(releaseCacheKey, JSON.stringify({ checkedAt: Date.now(), release })); }
  catch { /* A full or disabled local store must not stop a download. */ }
}

function platformKey(): string {
  const platform = ((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform).toLowerCase();
  const arm = /arm|aarch64/.test(navigator.userAgent.toLowerCase()) || /arm/.test(platform);
  if (/mac/.test(platform)) return arm ? 'macos-arm64' : 'macos-x64';
  if (/win/.test(platform)) return 'windows-x64';
  return 'linux-x64';
}

async function latestRelease(): Promise<Release> {
  const cached = cachedRelease();
  if (cached) return cached;
  const response = await fetch(releaseApi, {
    cache: 'no-store',
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (!response.ok) throw new Error(`GitHub Releases returned ${response.status}`);
  const release = await response.json() as unknown;
  if (!validRelease(release)) throw new Error('GitHub Releases returned an invalid response');
  saveCachedRelease(release);
  return release;
}

async function resolveDownload(): Promise<boolean> {
  const button = document.querySelector<HTMLAnchorElement>('#platform-download')!;
  const note = document.querySelector<HTMLElement>('#platform-note')!;
  const status = document.querySelector<HTMLElement>('#release-status')!;
  const labels: Record<string, string> = { 'macos-arm64':'macOS (Apple silicon)', 'macos-x64':'macOS (Intel)', 'windows-x64':'Windows', 'linux-x64':'Linux AppImage' };
  const key = platformKey();
  try {
    const release = await latestRelease();
    const asset = release.assets.find((item) => item.name === filenames[key]);
    if (!asset?.browser_download_url || !release.assets.some((item) => item.name === 'latest.json')) throw new Error();
    button.href = asset.browser_download_url;
    button.textContent = `Download ${labels[key]} on GitHub (opens GitHub)`;
    note.textContent = `${release.tag_name} · checksum published · unsigned build`;
    button.dataset.releaseReady = 'true';
    status.hidden = true;
    return true;
  } catch {
    button.href = releasePage;
    button.textContent = 'Open releases page on GitHub (opens GitHub)';
    button.dataset.releaseUnavailable = 'true';
    note.textContent = 'Downloads are being published.';
    status.hidden = false;
    status.textContent = navigator.onLine ? 'No published installer was found. Check the releases page shortly.' : 'You appear offline. The sample repair book remains available after its first visit.';
    return false;
  }
}

const download = document.querySelector<HTMLAnchorElement>('#platform-download')!;
download.addEventListener('click', async (event) => {
  if (download.dataset.releaseReady === 'true' || download.dataset.releaseUnavailable === 'true') return;
  event.preventDefault();
  download.setAttribute('aria-busy', 'true');
  download.textContent = 'Checking GitHub downloads…';
  await resolveDownload();
  download.removeAttribute('aria-busy');
});

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

window.addEventListener('offline', () => { const status = document.querySelector<HTMLElement>('#release-status')!; status.hidden = false; status.textContent = 'You are offline. The sample repair book remains available after its first visit.'; });
if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) void navigator.serviceWorker.register('/sw.js');
