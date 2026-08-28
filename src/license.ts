const slug = 'dictation-repair-book';
const tokenKey = `sb_license:${slug}`;
const verdictKey = `sb_license_verdict:${slug}`;
const api = 'https://api.sociobot.in/api/v1';

type Verdict = { valid: boolean; checkedAt: number; reason?: string };

export const checkoutUrl = `${api}/products/${slug}/checkout`;

export function acceptReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(verdictKey, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', url);
}

export function cachedUnlock(): boolean {
  if (!localStorage.getItem(tokenKey)) return false;
  try { return Boolean((JSON.parse(localStorage.getItem(verdictKey) || '{}') as Verdict).valid); }
  catch { return false; }
}

export async function verifyLicense(force = false): Promise<Verdict> {
  const token = localStorage.getItem(tokenKey);
  if (!token) return { valid: false, checkedAt: Date.now(), reason: 'missing' };
  const cached = JSON.parse(localStorage.getItem(verdictKey) || '{}') as Partial<Verdict>;
  if (!force && cached.checkedAt && Date.now() - cached.checkedAt < 86_400_000) return cached as Verdict;
  try {
    const response = await fetch(`${api}/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const body = await response.json() as { valid: boolean; reason: string };
    const verdict = { valid: body.valid, reason: body.reason, checkedAt: Date.now() };
    localStorage.setItem(verdictKey, JSON.stringify(verdict));
    return verdict;
  } catch {
    return { valid: Boolean(cached.valid), checkedAt: cached.checkedAt || 0, reason: 'offline' };
  }
}

export function storeLicense(token: string): void {
  localStorage.setItem(tokenKey, token.trim());
  localStorage.setItem(verdictKey, JSON.stringify({ valid: true, checkedAt: 0 }));
}

export function clearLicense(): void {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(verdictKey);
}
