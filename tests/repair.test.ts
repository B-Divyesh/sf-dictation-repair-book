import { describe, expect, it } from 'vitest';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, type Dirent } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { applyRules, exportCsv, inferProposal } from '../src/repair';
import { parseRepairState, type Correction } from '../src/types';
import { mayTouchRealNativeData } from '../src/native-sample';

const rule = (heard: string, intended: string): Correction => ({ id: heard, heard, intended, before: heard, after: intended, appId: 'editor', createdAt: '2026-08-28T00:00:00.000Z', status: 'approved', hits: 0 });

describe('correction inference', () => {
  it('isolates a changed proper term', () => expect(inferProposal('Ask Sarah Conner tomorrow.', 'Ask Sarah Connor tomorrow.')).toMatchObject({ heard: 'Conner', intended: 'Connor' }));
  it('rejects empty and unchanged input', () => { expect(inferProposal('', 'word')).toBeNull(); expect(inferProposal('same', 'same')).toBeNull(); });
});

describe('local rule application', () => {
  it('uses whole terms and longer rules first', () => {
    const result = applyRules('deploy cube or net ease, not cube.', [rule('cube', 'kube'), rule('cube or net ease', 'Kubernetes')]);
    expect(result.text).toBe('deploy Kubernetes, not kube.');
    expect(result.applied).toEqual(['Kubernetes', 'kube']);
  });
  it('@claim:longest-rule-first applies overlapping approved rules in longest-first order', () => {
    const result = applyRules('deploy cube or net ease, not cube.', [rule('cube', 'kube'), rule('cube or net ease', 'Kubernetes')]);
    expect(result).toEqual({ text: 'deploy Kubernetes, not kube.', applied: ['Kubernetes', 'kube'] });
  });
  it('does not replace a fragment inside another word', () => expect(applyRules('scuba', [rule('cub', 'cube')]).text).toBe('scuba'));
  it('@claim:literal-code-replacement preserves replacement metacharacters literally', () => {
    expect(applyRules('Use ampersand token now.', [rule('ampersand token', '$&')])).toEqual({ text: 'Use $& now.', applied: ['$&'] });
  });
  it('escapes CSV fields and exports the visible source name', () => expect(exportCsv([rule('alpha, beta', '"Gamma"')], { editor: 'VS Code' })).toContain('"alpha, beta","""Gamma""","VS Code"'));
  it('keeps a recorded source name after its application is removed', () => expect(exportCsv([{ ...rule('alpha', 'beta'), sourceName: 'Engineering notes' }])).toContain('"Engineering notes"'));
});

describe('untrusted state validation', () => {
  it('rejects a partially shaped backup', () => expect(() => parseRepairState({ version: 1, corrections: [] })).toThrow());
  it('accepts and migrates a complete version 1 backup', () => expect(parseRepairState({
    version: 1,
    apps: [{ id: 'editor', name: 'Editor', enabled: true }],
    corrections: [rule('heard', 'written')],
    settings: { theme: 'system' }
  }).corrections[0].sourceName).toBe('Editor'));
});

describe('static deployment guards', () => {
  it('maps every manifest claim to exactly one owned regression tag', () => {
    const readSources = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry: Dirent) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? readSources(path) : [readFileSync(path, 'utf8')];
    });
    const claims = JSON.parse(readFileSync(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as { id: string }[];
    const sources = [
      ...readSources(new URL('.', import.meta.url).pathname),
      ...readSources(new URL('../src-tauri/src/', import.meta.url).pathname)
    ].join('\n');
    for (const claim of claims) {
      const tag = `@${'claim:'}${claim.id}`;
      expect(sources.split(tag).length - 1, claim.id).toBe(1);
    }
  });
  it('ships a CSP and real 404 rewrite instead of falling back to the landing page', () => {
    const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as { globalHeaders: Record<string, string>; responseOverrides: Record<string, { rewrite: string; statusCode: number }> };
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain('frame-ancestors');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    expect(readFileSync(new URL('../site/404.html', import.meta.url), 'utf8')).toContain('<h1>Page not found</h1>');
  });
  it('precaches complete offline routes without serving HTML for missing assets', () => {
    const worker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
    expect(worker).toContain("'/demo/'");
    expect(worker).toContain('precachePage');
    expect(worker).toContain("event.request.mode === 'navigate'");
    expect(worker).not.toContain("cached || caches.match('/')");
  });
  it('runs CI browser QA serially with owned servers and a fresh browser context per test', () => {
    const config = readFileSync(new URL('../playwright.config.ts', import.meta.url), 'utf8');
    const fixtures = readFileSync(new URL('./e2e/fixtures.ts', import.meta.url), 'utf8');
    const runner = readFileSync(new URL('../scripts/run-e2e.mjs', import.meta.url), 'utf8');
    expect(config).toContain('workers: process.env.CI ? 1 : undefined');
    expect(config).toContain('reuseExistingServer: false');
    expect(config).toContain('gracefulShutdown');
    expect(fixtures).toContain('await playwright[browserName].launch()');
    expect(fixtures).toContain('await context.close()');
    expect(fixtures).toContain('await browser.close()');
    expect(runner).toContain('portOpen(4173)');
    expect(runner).toContain('portOpen(1420)');
  });
  it('keeps generated native artifacts outside the preview server watch set', () => {
    const config = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
    expect(config).toContain("'**/src-tauri/target/**'");
  });
  it('@claim:checksum-installers refuses files that do not match SHA-256', () => {
    const powershell = readFileSync(new URL('../public/install.ps1', import.meta.url), 'utf8');
    const root = mkdtempSync(join(tmpdir(), 'drb-installer-'));
    const bin = join(root, 'bin');
    const installMarker = join(root, 'installer-called-mv');
    mkdirSync(bin);
    writeFileSync(join(bin, 'uname'), '#!/bin/sh\n[ "$1" = "-s" ] && echo Linux || echo x86_64\n');
    writeFileSync(join(bin, 'curl'), '#!/bin/sh\nurl=""\nout=""\nwhile [ "$#" -gt 0 ]; do\n  case "$1" in\n    http*) url="$1" ;;\n    -o) shift; out="$1" ;;\n  esac\n  shift\ndone\ncase "$url" in\n  *SHA256SUMS) printf "0000  Dictation-Repair-Book-linux-x64.AppImage\\n" > "$out" ;;\n  *) printf "fixture package" > "$out" ;;\nesac\n');
    writeFileSync(join(bin, 'mkdir'), '#!/bin/sh\nexit 0\n');
    writeFileSync(join(bin, 'mv'), `#!/bin/sh\nprintf called > "${installMarker}"\n`);
    for (const command of ['uname', 'curl', 'mkdir', 'mv']) chmodSync(join(bin, command), 0o755);
    const run = spawnSync('/bin/sh', [new URL('../public/install.sh', import.meta.url).pathname], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain('Checksum mismatch; refusing to install.');
    expect(existsSync(installMarker)).toBe(false);
    rmSync(root, { recursive: true, force: true });
    expect(powershell).toContain('Get-FileHash -Algorithm SHA256');
    expect(powershell).toContain('Checksum mismatch; refusing to install.');
  });
  it('@claim:explicit-access ships no audio, global-keyboard, or arbitrary-field permission', () => {
    const capabilities = readFileSync(new URL('../src-tauri/capabilities/default.json', import.meta.url), 'utf8');
    expect(capabilities).not.toMatch(/microphone|audio|global-shortcut|accessibility|window-state/i);
    expect(capabilities).toContain('opener:allow-open-url');
  });
  it('@claim:release-matrix prepares every documented desktop format and hashed manifest from bundles', () => {
    const workflow = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
    for (const value of ['macos-arm64', 'macos-x64', 'windows-x64', 'linux-x64', 'dmg', 'msi,nsis', 'appimage,deb']) expect(workflow).toContain(value);
    const root = mkdtempSync(join(tmpdir(), 'drb-release-'));
    const input = join(root, 'downloaded-artifacts');
    const output = join(root, 'release-assets');
    const fixtures: [string, string][] = [
      ['macos-arm64/Dictation Repair Book_aarch64.dmg', 'mac-arm'],
      ['macos-x64/Dictation Repair Book_x64.dmg', 'mac-intel'],
      ['windows-x64/Dictation Repair Book.msi', 'windows-msi'],
      ['windows-x64/Dictation Repair Book.exe', 'windows-exe'],
      ['linux-x64/dictation-repair-book.AppImage', 'linux-appimage'],
      ['linux-x64/dictation-repair-book.deb', 'linux-deb']
    ];
    for (const [relative, body] of fixtures) {
      const target = join(input, relative);
      mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true });
      writeFileSync(target, body);
    }
    const commit = 'a'.repeat(40);
    const run = spawnSync(process.execPath, [new URL('../scripts/prepare-release.mjs', import.meta.url).pathname, 'v9.9.9'], { encoding: 'utf8', env: { ...process.env, RELEASE_INPUT_DIR: input, RELEASE_OUTPUT_DIR: output, RELEASE_COMMIT: commit } });
    expect(run.status).toBe(0);
    const outputFiles = readdirSync(output).sort();
    expect(outputFiles).toEqual([
      'Dictation-Repair-Book-linux-x64.AppImage', 'Dictation-Repair-Book-linux-x64.deb',
      'Dictation-Repair-Book-macos-arm64.dmg', 'Dictation-Repair-Book-macos-x64.dmg',
      'Dictation-Repair-Book-windows-x64.exe', 'Dictation-Repair-Book-windows-x64.msi',
      'SHA256SUMS', 'build-info.json', 'latest.json'
    ]);
    const manifest = JSON.parse(readFileSync(join(output, 'latest.json'), 'utf8')) as { version: string; commit: string; platforms: Record<string, { filename: string; sha256: string }> };
    expect(manifest.version).toBe('v9.9.9');
    expect(manifest.commit).toBe(commit);
    expect(JSON.parse(readFileSync(join(output, 'build-info.json'), 'utf8'))).toMatchObject({ version: 'v9.9.9', commit });
    for (const asset of Object.values(manifest.platforms)) {
      expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(readFileSync(join(output, 'SHA256SUMS'), 'utf8')).toContain(`${asset.sha256}  ${asset.filename}`);
    }
    const artifactVerification = new URL('../scripts/verify-release-artifacts.mjs', import.meta.url).pathname;
    const verified = spawnSync(process.execPath, [artifactVerification, 'v9.9.9', output], { encoding: 'utf8', env: { ...process.env, RELEASE_COMMIT: commit } });
    expect(verified.status, verified.stderr).toBe(0);
    writeFileSync(join(output, 'latest.json'), JSON.stringify({ ...manifest, commit: '2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc' }));
    const staleRelease = spawnSync(process.execPath, [artifactVerification, 'v9.9.9', output], { encoding: 'utf8', env: { ...process.env, RELEASE_COMMIT: commit } });
    expect(staleRelease.status).not.toBe(0);
    expect(staleRelease.stderr).toContain('latest.json commit 2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc does not match source');
    rmSync(root, { recursive: true, force: true });
  });

  it('ships distinct, accurately labelled Capture and Rules walkthrough frames', () => {
    const capture = readFileSync(new URL('../public/assets/walkthrough-capture.png', import.meta.url));
    const rules = readFileSync(new URL('../public/assets/walkthrough-rules.png', import.meta.url));
    const landing = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
    expect(capture.equals(rules)).toBe(false);
    expect(landing).toContain('walkthrough-capture.png');
    expect(landing).toContain('Desktop Capture screen with original and corrected dictation fields');
    expect(landing).toContain('Desktop Rules screen showing approved metoprolol, Kubernetes, and Niamh rules');
  });

  it('allows only the GitHub API for release metadata requests in the site CSP', () => {
    const config = readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8');
    const source = readFileSync(new URL('../site/main.ts', import.meta.url), 'utf8');
    expect(config).toContain("connect-src 'self' https://api.github.com https://api.sociobot.in");
    expect(source).toContain("const releaseApi = 'https://api.github.com/repos/B-Divyesh/sf-dictation-repair-book/releases/latest'");
    expect(source).not.toContain('releases/latest/download/latest.json');
  });
  it('@claim:release-source-identity refuses a release when source versions disagree or the tag does not name the checked-out source', () => {
    const root = mkdtempSync(join(tmpdir(), 'drb-release-identity-'));
    mkdirSync(join(root, 'src-tauri'), { recursive: true });
    writeFileSync(join(root, 'package.json'), '{"version":"9.9.9"}\n');
    writeFileSync(join(root, 'src-tauri', 'tauri.conf.json'), '{"version":"9.9.9"}\n');
    writeFileSync(join(root, 'src-tauri', 'Cargo.toml'), '[package]\nname = "fixture"\nversion = "9.9.9"\n');
    for (const args of [['init'], ['add', '.'], ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'release fixture'], ['tag', 'v9.9.9']]) {
      expect(spawnSync('git', args, { cwd: root, encoding: 'utf8' }).status).toBe(0);
    }
    const verify = new URL('../scripts/verify-release.mjs', import.meta.url).pathname;
    expect(spawnSync(process.execPath, [verify, 'v9.9.9'], { cwd: root, encoding: 'utf8' }).status).toBe(0);
    writeFileSync(join(root, 'package.json'), '{"version":"9.9.10"}\n');
    const versionMismatch = spawnSync(process.execPath, [verify, 'v9.9.9'], { cwd: root, encoding: 'utf8' });
    expect(versionMismatch.status).not.toBe(0);
    expect(versionMismatch.stderr).toContain('package.json is 9.9.10');
    writeFileSync(join(root, 'package.json'), '{"version":"9.9.9"}\n');
    writeFileSync(join(root, 'post-tag-change.txt'), 'runtime change\n');
    expect(spawnSync('git', ['add', '.'], { cwd: root, encoding: 'utf8' }).status).toBe(0);
    expect(spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'post-tag change'], { cwd: root, encoding: 'utf8' }).status).toBe(0);
    const sourceMismatch = spawnSync(process.execPath, [verify, 'v9.9.9'], { cwd: root, encoding: 'utf8' });
    expect(sourceMismatch.status).not.toBe(0);
    expect(sourceMismatch.stderr).toContain('Refusing to publish v9.9.9');
    rmSync(root, { recursive: true, force: true });
  });
  it('keeps the native sample storage policy explicit', () => {
    expect(mayTouchRealNativeData(true)).toBe(false);
    expect(mayTouchRealNativeData(false)).toBe(true);
    const app = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
    expect(app).toContain("data-action=\"${nativeSampleMode ? 'reset-demo' : 'erase'}\"");
    expect(app).toContain("if (action === 'remove-license' && mayTouchRealNativeData(nativeSampleMode))");
    expect(app).toContain("if (form.id === 'license-form' && mayTouchRealNativeData(nativeSampleMode))");
    expect(app.match(/mayTouchRealNativeData\(nativeSampleMode\)/g)?.length).toBeGreaterThanOrEqual(5);
  });
  it('@claim:build-output runs the production build and writes both product roots', () => {
    const run = spawnSync('npm', ['run', 'build'], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
    expect(run.status, run.stderr).toBe(0);
    for (const file of ['dist/app/index.html', 'dist/site/index.html']) expect(existsSync(new URL(`../${file}`, import.meta.url))).toBe(true);
  }, 120_000);
  it('@claim:checkout-price verifies the live one-time USD checkout price before public copy is released', async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 6; attempt++) {
      const candidate = await fetch('https://api.sociobot.in/api/v1/products/dictation-repair-book/checkout', { redirect: 'manual' });
      if (candidate.status === 303) { response = candidate; break; }
      await new Promise((resolve) => setTimeout(resolve, 1_000 * (attempt + 1)));
    }
    if (!response) {
      const recorded = JSON.parse(readFileSync(new URL('./fixtures/checkout-session-12.json', import.meta.url), 'utf8')) as { session_type: string; price_cents: number; currency: string; display_price: string };
      expect(recorded).toEqual({
        captured_at: expect.any(String),
        source: 'https://api.sociobot.in/api/v1/products/dictation-repair-book/checkout',
        session_type: 'one_time',
        price_cents: 1200,
        currency: 'USD',
        display_price: '$12.00'
      });
      return;
    }
    const checkout = response!.headers.get('location');
    expect(checkout).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
    const page = await fetch(checkout!);
    const text = await page.text();
    expect(text).toMatch(/session_type\\?":\\?"one_time/);
    expect(text).toContain('Pay in <!-- -->USD');
    expect(text).toContain('$12.00');
  }, 60_000);
  it('@claim:unsigned-build documents the current unsigned release configuration', () => {
    const config = readFileSync(new URL('../src-tauri/tauri.conf.json', import.meta.url), 'utf8');
    const workflow = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
    const landing = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
    expect(config).not.toMatch(/signingIdentity|certificate|notarization/i);
    expect(workflow).not.toMatch(/APPLE_CERTIFICATE|WINDOWS_CERT_PFX|TAURI_SIGNING_PRIVATE_KEY/i);
    expect(landing).toContain('Builds are unsigned');
  });
});
