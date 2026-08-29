import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { applyRules, exportCsv, inferProposal } from '../src/repair';
import { parseRepairState, type Correction } from '../src/types';

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
  it('ships a CSP and real 404 rewrite instead of falling back to the landing page', () => {
    const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as { globalHeaders: Record<string, string>; responseOverrides: Record<string, { rewrite: string; statusCode: number }> };
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain('frame-ancestors');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    expect(readFileSync(new URL('../site/404.html', import.meta.url), 'utf8')).toContain('<h1>This page is not in the repair book.</h1>');
  });
  it('precaches complete offline routes without serving HTML for missing assets', () => {
    const worker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
    expect(worker).toContain("'/demo/'");
    expect(worker).toContain('precachePage');
    expect(worker).toContain("event.request.mode === 'navigate'");
    expect(worker).not.toContain("cached || caches.match('/')");
  });
  it('@claim:checksum-installers refuses files that do not match SHA-256', () => {
    const shell = readFileSync(new URL('../public/install.sh', import.meta.url), 'utf8');
    const powershell = readFileSync(new URL('../public/install.ps1', import.meta.url), 'utf8');
    expect(shell).toContain('Checksum mismatch; refusing to install.');
    expect(shell).toContain('sha256sum');
    expect(powershell).toContain('Get-FileHash -Algorithm SHA256');
    expect(powershell).toContain('Checksum mismatch; refusing to install.');
  });
  it('@claim:explicit-access ships no audio, global-keyboard, or arbitrary-field permission', () => {
    const capabilities = readFileSync(new URL('../src-tauri/capabilities/default.json', import.meta.url), 'utf8');
    expect(capabilities).not.toMatch(/microphone|audio|global-shortcut|accessibility|window-state/i);
    expect(capabilities).toContain('opener:allow-open-url');
  });
  it('@claim:release-matrix builds every documented desktop format', () => {
    const workflow = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
    for (const value of ['macos-arm64', 'macos-x64', 'windows-x64', 'linux-x64', 'dmg', 'msi,nsis', 'appimage,deb']) expect(workflow).toContain(value);
    const prepare = readFileSync(new URL('../scripts/prepare-release.mjs', import.meta.url), 'utf8');
    expect(prepare).toContain('SHA256SUMS');
    expect(prepare).toContain('latest.json');
  });
});
