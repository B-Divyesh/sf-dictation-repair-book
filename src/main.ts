import './style.css';
import { applyRules, exportCsv, exportWhisper, inferProposal, type Proposal } from './repair';
import { eraseVault, isNative, loadState, readClipboard, saveState, writeClipboard } from './storage';
import { acceptReturnedLicense, cachedUnlock, checkoutUrl, clearLicense, storeLicense, verifyLicense } from './license';
import type { Correction, RepairState } from './types';

type Page = 'capture' | 'rules' | 'test' | 'settings';
let state = await loadState();
let page: Page = 'capture';
let proposal: Proposal | null = null;
let testResult: { text: string; applied: string[] } | null = null;
let notice = '';
let unlocked = cachedUnlock();
let lastRemoved: Correction | null = null;

acceptReturnedLicense();
unlocked = cachedUnlock();
void verifyLicense().then((v) => { unlocked = v.valid; if (v.reason !== 'offline') render(); });

const app = document.querySelector<HTMLDivElement>('#app')!;
const esc = (s: string) => s.replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]!);
const approved = () => state.corrections.filter((r) => r.status === 'approved');
const activeApps = () => state.apps.filter((a) => a.enabled);

function chrome(content: string, title: string, kicker: string) {
  const tabs: { id: Page; label: string; key: string; icon: string }[] = [
    { id: 'capture', label: 'Capture', key: '1', icon: '↯' },
    { id: 'rules', label: 'Rules', key: '2', icon: 'Aa' },
    { id: 'test', label: 'Test', key: '3', icon: '✓' },
    { id: 'settings', label: 'Settings', key: '4', icon: '⚙' }
  ];
  return `<div class="app-shell" data-theme="${state.settings.theme}">
    <aside class="rail" aria-label="Product navigation">
      <a class="brand" href="#capture" data-nav="capture" aria-label="Dictation Repair Book, capture page"><span class="brand-mark" aria-hidden="true">DR<br>BK</span><h1>Dictation<br>Repair Book</h1></a>
      <nav aria-label="Repair book sections">${tabs.map((tab) => `<button class="nav-item ${page === tab.id ? 'active' : ''}" data-nav="${tab.id}" aria-current="${page === tab.id ? 'page' : 'false'}"><span aria-hidden="true">${tab.icon}</span>${tab.label}<kbd>${tab.key}</kbd></button>`).join('')}</nav>
      <div class="privacy-stamp"><span>LOCAL ONLY</span><p>${isNative() ? 'Vault encrypted on this device.' : 'Browser preview uses local storage.'}</p></div>
    </aside>
    <main id="main" tabindex="-1">
      <header class="work-header"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div><span class="rule-count"><b>${approved().length}</b> approved</span></header>
      ${notice ? `<div class="notice" role="status">${esc(notice)}${lastRemoved ? ' <button data-action="undo-delete">Undo</button>' : ''}</div>` : ''}
      ${content}
    </main>
  </div>`;
}

function capturePage() {
  if (!activeApps().length) return chrome(`<section class="empty-state"><span class="empty-glyph" aria-hidden="true">＋</span><p class="stamp">FIRST STEP</p><h3>Choose where corrections come from.</h3><p>The repair book never watches every field. Add a named application, then capture clipboard text only when you click.</p><form id="add-app-form"><label for="first-app">Application name</label><div class="inline-form"><input id="first-app" name="name" required maxlength="50" autocomplete="off" placeholder="e.g. VS Code"><button class="button primary" type="submit">Allow this app</button></div></form></section>`, 'Capture a correction', 'Approved sources only');
  const freeFull = !unlocked && approved().length >= 25;
  return chrome(`<section class="capture-grid">
    <form id="capture-form" class="repair-sheet">
      <div class="scope-row"><label for="scope">Correction source</label><select id="scope" name="scope">${activeApps().map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select><span class="consent-note">Reads only when asked</span></div>
      <div class="step"><span class="step-no">01</span><div><label for="before">What dictation wrote</label><p>Copy the uncorrected transcript, then capture it.</p></div><button class="button secondary" type="button" data-clip="before">Paste clipboard</button></div>
      <textarea id="before" name="before" rows="5" required spellcheck="false" placeholder="deploy the cube or net ease service"></textarea>
      <div class="repair-arrow" aria-hidden="true"><span></span>REPAIR<span></span></div>
      <div class="step"><span class="step-no">02</span><div><label for="after">What you meant</label><p>Edit it here, or copy your corrected version.</p></div><button class="button secondary" type="button" data-clip="after">Paste clipboard</button></div>
      <textarea id="after" name="after" rows="5" required spellcheck="true" placeholder="deploy the Kubernetes service"></textarea>
      <div class="sheet-actions"><span>Audio is never recorded.</span><button class="button primary" type="submit">Propose a rule <span aria-hidden="true">→</span></button></div>
    </form>
    <aside class="proposal-panel" aria-live="polite"><p class="eyebrow">Rule proposal</p>${proposal ? `<div class="diff-pair"><div><span>HEARD</span><s>${esc(proposal.heard)}</s></div><i aria-hidden="true">→</i><div><span>WRITE</span><mark>${esc(proposal.intended)}</mark></div></div><p class="proposal-copy">When this exact phrase appears as a whole term, replace it. Longer rules run first.</p>${freeFull ? `<div class="limit-note"><b>Free book full.</b><p>Your 25 rules and exports still work. Unlock unlimited approvals for $24 once.</p><a class="button primary" href="${checkoutUrl}">Unlock unlimited</a></div>` : `<button class="button approve" data-action="approve">Approve rule</button>`}<button class="button text-button" data-action="discard">Discard proposal</button>` : `<div class="proposal-empty"><span aria-hidden="true">↳</span><p>Your changed words will appear here before anything is saved.</p></div>`}</aside>
  </section>`, 'Capture a correction', 'Explicit before / after');
}

function rulesPage() {
  const rows = approved();
  return chrome(`<section class="rules-tools"><div><label for="rule-search">Find a rule</label><input id="rule-search" type="search" placeholder="Search spelling or heard phrase"></div><div class="export-shortcut"><span>Portable by default</span><button class="button secondary" data-action="export-csv">Export CSV</button></div></section>
  ${rows.length ? `<div class="rule-table-wrap"><table class="rule-table"><thead><tr><th>When it hears</th><th>Write this</th><th>Source</th><th>Added</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows.map((r) => `<tr data-search="${esc(`${r.heard} ${r.intended}`.toLowerCase())}"><td><s>${esc(r.heard)}</s></td><td><strong>${esc(r.intended)}</strong></td><td>${esc(state.apps.find((a) => a.id === r.appId)?.name || 'Any approved app')}</td><td><time datetime="${r.createdAt}">${new Date(r.createdAt).toLocaleDateString()}</time></td><td><button class="icon-button danger" data-delete="${r.id}" aria-label="Delete rule ${esc(r.heard)} to ${esc(r.intended)}">×</button></td></tr>`).join('')}</tbody></table></div>` : `<section class="empty-state compact"><span class="empty-glyph" aria-hidden="true">Aa</span><h3>No approved rules yet.</h3><p>Capture one before/after correction. The book will infer only the words that changed.</p><button class="button primary" data-nav="capture">Capture first rule</button></section>`}`, 'Approved vocabulary', 'Inspectable and portable');
}

function testPage() {
  return chrome(`<section class="test-layout"><div class="test-sheet"><p class="stamp">BLIND RETEST</p><h3>Try a fresh transcript.</h3><p>Paste dictation you have not edited. The repair runs locally using approved whole-term rules.</p><form id="test-form"><label for="test-input">Unrepaired transcript</label><textarea id="test-input" name="input" rows="7" required placeholder="Paste a new transcript…"></textarea><div class="sheet-actions"><button class="button secondary" type="button" data-clip="test-input">Paste clipboard</button><button class="button primary" type="submit">Run repair</button></div></form></div><div class="result-sheet" aria-live="polite"><p class="eyebrow">Repaired clipboard</p>${testResult ? `<div class="result-text">${esc(testResult.text)}</div><p>${testResult.applied.length ? `<b>${testResult.applied.length}</b> rule${testResult.applied.length === 1 ? '' : 's'} applied: ${esc(testResult.applied.join(', '))}` : 'No matching approved terms.'}</p><button class="button approve" data-action="copy-result">Copy repaired text</button>` : `<div class="proposal-empty"><span aria-hidden="true">✓</span><p>The repaired result and applied-rule count will appear here.</p></div>`}</div></section>`, 'Test your repair book', `${approved().length} rules ready`);
}

function settingsPage() {
  return chrome(`<div class="settings-stack">
    <section class="settings-section"><div><p class="eyebrow">Approved sources</p><h3>Application access</h3><p>Labels are a consent boundary and are stored locally. Clipboard capture still happens only after your click.</p></div><div><ul class="app-list">${state.apps.map((a) => `<li><label><input type="checkbox" data-app-toggle="${a.id}" ${a.enabled ? 'checked' : ''}><span>${esc(a.name)}</span></label><button class="icon-button danger" data-app-delete="${a.id}" aria-label="Remove ${esc(a.name)}">×</button></li>`).join('')}</ul><form id="add-app-form" class="inline-form"><label class="sr-only" for="new-app">New application</label><input id="new-app" name="name" required maxlength="50" placeholder="Add application"><button class="button secondary">Add</button></form></div></section>
    <section class="settings-section"><div><p class="eyebrow">Interoperability</p><h3>Take your words anywhere</h3><p>Exports are always available, even without a paid license.</p></div><div class="button-grid"><button class="button secondary" data-action="export-csv">Export CSV</button><button class="button secondary" data-action="export-json">Back up JSON</button><button class="button secondary" data-action="export-whisper">Copy Whisper prompt</button><label class="button secondary file-button">Import JSON<input id="import-json" type="file" accept="application/json,.json"></label></div></section>
    <section class="settings-section"><div><p class="eyebrow">Appearance</p><h3>Theme</h3></div><fieldset class="segmented"><legend class="sr-only">Color theme</legend>${['system','light','dark'].map((t) => `<label><input type="radio" name="theme" value="${t}" ${state.settings.theme === t ? 'checked' : ''}><span>${t[0].toUpperCase()+t.slice(1)}</span></label>`).join('')}</fieldset></section>
    <section class="settings-section license"><div><p class="eyebrow">One-time unlock</p><h3>${unlocked ? 'Unlimited book active' : 'Keep an unlimited repair book'}</h3><p>${unlocked ? 'This device has a valid license. Verification is cached for one day.' : 'Free includes 25 approved rules, testing, and every export. Pay $24 once for unlimited approved rules. Sociobot/Dodo is merchant of record.'}</p><p><a href="https://dictation-repair-book.sociobot.in/privacy">Privacy</a> · <a href="https://dictation-repair-book.sociobot.in/terms">Terms</a></p></div><div>${unlocked ? `<span class="stamp success">LICENSE ACTIVE</span><button class="button text-button" data-action="remove-license">Remove from device</button>` : `<a class="button primary" href="${checkoutUrl}">Buy once — $24</a><form id="license-form"><label for="license-token">Have a license? Paste it</label><div class="inline-form"><input id="license-token" name="token" required autocomplete="off"><button class="button secondary">Verify</button></div></form>`}</div></section>
    <section class="settings-section danger-zone"><div><p class="eyebrow">Delete local data</p><h3>Erase this repair book</h3><p>Removes the encrypted vault and its local key. Export first if you want a copy.</p></div><button class="button danger-button" data-action="erase">Erase all local data</button></section>
  </div>`, 'Settings & data', isNative() ? 'Encrypted native vault' : 'Web preview mode');
}

function render() {
  proposal = page === 'capture' ? proposal : null;
  app.innerHTML = page === 'capture' ? capturePage() : page === 'rules' ? rulesPage() : page === 'test' ? testPage() : settingsPage();
}

async function persist(message = '') { await saveState(state); notice = message; render(); }
function download(name: string, data: string, type: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
function exportAction(kind: string) {
  if (kind === 'csv') download('dictation-rules.csv', exportCsv(approved()), 'text/csv');
  if (kind === 'json') download('dictation-repair-book.json', JSON.stringify(state, null, 2), 'application/json');
  if (kind === 'whisper') void writeClipboard(exportWhisper(approved())).then(() => { notice = 'Whisper vocabulary copied to the clipboard.'; render(); });
}

app.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  const external = target.closest<HTMLAnchorElement>('a[href^="https://"]');
  if (external && isNative()) { event.preventDefault(); const { openUrl } = await import('@tauri-apps/plugin-opener'); await openUrl(external.href); return; }
  const nav = target.closest<HTMLElement>('[data-nav]')?.dataset.nav as Page | undefined;
  if (nav) { page = nav; notice = ''; render(); return; }
  const clip = target.closest<HTMLElement>('[data-clip]')?.dataset.clip;
  if (clip) { try { (document.getElementById(clip) as HTMLTextAreaElement).value = await readClipboard(); notice = ''; } catch { notice = 'Clipboard access was blocked. Paste with Ctrl/Command+V instead.'; render(); } return; }
  const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
  if (action === 'approve' && proposal) {
    const form = document.querySelector<HTMLFormElement>('#capture-form')!;
    const data = new FormData(form);
    state.corrections.unshift({ id: crypto.randomUUID(), before: String(data.get('before')), after: String(data.get('after')), heard: proposal.heard, intended: proposal.intended, appId: String(data.get('scope')), createdAt: new Date().toISOString(), status: 'approved', hits: 0 });
    proposal = null; await persist('Rule approved and encrypted in your local book.');
  }
  if (action === 'discard') { proposal = null; notice = 'Proposal discarded. Nothing was saved.'; render(); }
  if (action === 'copy-result' && testResult) { await writeClipboard(testResult.text); notice = 'Repaired text copied.'; render(); }
  if (action?.startsWith('export-')) exportAction(action.slice(7));
  if (action === 'remove-license') { clearLicense(); unlocked = false; notice = 'License removed from this device.'; render(); }
  if (action === 'erase' && confirm(`Erase all ${state.corrections.length} corrections and application labels from this device? This cannot be undone.`)) { await eraseVault(); localStorage.removeItem('drb_web_preview_state'); state = { version: 1, apps: [], corrections: [], settings: { theme: 'system' } }; notice = 'Local repair book erased.'; page = 'capture'; render(); }
  if (action === 'undo-delete' && lastRemoved) { state.corrections.unshift(lastRemoved); lastRemoved = null; await persist('Rule restored.'); }
  const deleteId = target.closest<HTMLElement>('[data-delete]')?.dataset.delete;
  if (deleteId) { const found = state.corrections.find((r) => r.id === deleteId); if (found) { lastRemoved = found; state.corrections = state.corrections.filter((r) => r.id !== deleteId); await persist(`Deleted rule “${found.heard} → ${found.intended}”.`); } }
  const appDelete = target.closest<HTMLElement>('[data-app-delete]')?.dataset.appDelete;
  if (appDelete) { const found = state.apps.find((a) => a.id === appDelete); if (found && confirm(`Remove ${found.name} from approved sources? Existing rules remain.`)) { state.apps = state.apps.filter((a) => a.id !== appDelete); await persist(`${found.name} removed from approved sources.`); } }
});

app.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.target as HTMLFormElement; const data = new FormData(form);
  if (form.id === 'add-app-form') { const name = String(data.get('name')).trim(); if (name) { state.apps.push({ id: crypto.randomUUID(), name, enabled: true }); await persist(`${name} added as an approved source.`); } }
  if (form.id === 'capture-form') { proposal = inferProposal(String(data.get('before')), String(data.get('after'))); notice = proposal ? '' : 'I could not isolate a changed term. Include one complete before and after phrase.'; render(); }
  if (form.id === 'test-form') { testResult = applyRules(String(data.get('input')), approved()); for (const rule of state.corrections) if (testResult.applied.includes(rule.intended)) rule.hits++; await saveState(state); render(); }
  if (form.id === 'license-form') { storeLicense(String(data.get('token'))); const verdict = await verifyLicense(true); unlocked = verdict.valid; notice = verdict.valid ? 'License verified. Unlimited rules are active.' : verdict.reason === 'offline' ? 'Could not reach verification. Your last valid status is unchanged.' : 'That license is not active for this product.'; render(); }
});

app.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement;
  if (input.dataset.appToggle) { const item = state.apps.find((a) => a.id === input.dataset.appToggle); if (item) { item.enabled = input.checked; await persist(`${item.name} ${item.enabled ? 'enabled' : 'paused'}.`); } }
  if (input.name === 'theme') { state.settings.theme = input.value as RepairState['settings']['theme']; await persist('Theme preference saved.'); }
  if (input.id === 'import-json' && input.files?.[0]) { try { const incoming = JSON.parse(await input.files[0].text()) as RepairState; if (incoming.version !== 1 || !Array.isArray(incoming.corrections)) throw new Error(); state = incoming; await persist('Repair book imported and encrypted locally.'); } catch { notice = 'That file is not a valid Dictation Repair Book backup.'; render(); } }
});

app.addEventListener('input', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === 'rule-search') document.querySelectorAll<HTMLTableRowElement>('[data-search]').forEach((row) => { row.hidden = !row.dataset.search!.includes(input.value.toLowerCase()); });
});

window.addEventListener('keydown', (event) => { if (event.altKey && ['1','2','3','4'].includes(event.key)) { page = (['capture','rules','test','settings'] as Page[])[Number(event.key)-1]; render(); } });
render();
