import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { applyRules, exportCsv, inferProposal } from '../src/repair';
import type { Correction } from '../src/types';

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
  it('escapes CSV fields and exports the visible source name', () => expect(exportCsv([rule('alpha, beta', '"Gamma"')], { editor: 'VS Code' })).toContain('"alpha, beta","""Gamma""","VS Code"'));
});

describe('static deployment guards', () => {
  it('ships a CSP and real 404 rewrite instead of falling back to the landing page', () => {
    const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as { globalHeaders: Record<string, string>; responseOverrides: Record<string, { rewrite: string; statusCode: number }> };
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain('frame-ancestors');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    expect(readFileSync(new URL('../site/404.html', import.meta.url), 'utf8')).toContain('<h1>This page is not in the repair book.</h1>');
  });
});
