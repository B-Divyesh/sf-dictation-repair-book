import type { Correction } from './types';

export type Proposal = { heard: string; intended: string; prefix: string; suffix: string };

export function inferProposal(before: string, after: string): Proposal | null {
  const a = before.trim();
  const b = after.trim();
  if (!a || !b || a === b) return null;
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let aEnd = a.length;
  let bEnd = b.length;
  while (aEnd > start && bEnd > start && a[aEnd - 1] === b[bEnd - 1]) {
    aEnd--;
    bEnd--;
  }
  const isTerm = (char: string | undefined) => Boolean(char && /[\p{L}\p{N}_-]/u.test(char));
  while (start > 0 && isTerm(a[start - 1]) && isTerm(b[start - 1])) start--;
  while (aEnd < a.length && isTerm(a[aEnd])) aEnd++;
  while (bEnd < b.length && isTerm(b[bEnd])) bEnd++;
  const prefix = a.slice(0, start);
  const suffix = a.slice(aEnd);
  const heard = a.slice(start, aEnd).trim().replace(/^[,.;:!?]+|[,.;:!?]+$/g, '');
  const intended = b.slice(start, bEnd).trim().replace(/^[,.;:!?]+|[,.;:!?]+$/g, '');
  if (!heard || !intended) return null;
  return { heard, intended, prefix, suffix };
}

export function applyRules(input: string, rules: Correction[]): { text: string; applied: string[] } {
  let text = input;
  const applied: string[] = [];
  const ordered = rules.filter((r) => r.status === 'approved').sort((a, b) => b.heard.length - a.heard.length);
  for (const rule of ordered) {
    const escaped = rule.heard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const expression = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu');
    if (expression.test(text)) {
      text = text.replace(expression, rule.intended);
      applied.push(rule.intended);
    }
  }
  return { text, applied };
}

export function exportCsv(rules: Correction[]): string {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return ['heard,intended,application,approved_at,hits', ...rules.filter((r) => r.status === 'approved').map((r) =>
    [r.heard, r.intended, r.appId, r.createdAt, String(r.hits)].map(quote).join(','))].join('\n');
}

export function exportWhisper(rules: Correction[]): string {
  return rules.filter((r) => r.status === 'approved').map((r) => r.intended).filter((v, i, a) => a.indexOf(v) === i).join(', ');
}
