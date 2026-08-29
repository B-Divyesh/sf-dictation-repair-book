export type AppScope = { id: string; name: string; enabled: boolean };
export type Correction = {
  id: string;
  before: string;
  after: string;
  heard: string;
  intended: string;
  appId: string;
  sourceName?: string;
  createdAt: string;
  status: 'draft' | 'approved';
  hits: number;
};
export type RepairState = {
  version: 1;
  apps: AppScope[];
  corrections: Correction[];
  settings: { theme: 'system' | 'light' | 'dark' };
};

export const emptyState = (): RepairState => ({
  version: 1,
  apps: [],
  corrections: [],
  settings: { theme: 'system' }
});

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/** Parse untrusted storage or import data before it reaches rendering or persistence. */
export function parseRepairState(value: unknown): RepairState {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.apps) || !Array.isArray(value.corrections) || !isRecord(value.settings)) throw new Error('Invalid repair-book shape');
  if (!['system', 'light', 'dark'].includes(String(value.settings.theme))) throw new Error('Invalid theme');

  const apps = value.apps.map((app) => {
    if (!isRecord(app) || !isNonEmptyString(app.id) || !isNonEmptyString(app.name) || typeof app.enabled !== 'boolean') throw new Error('Invalid application');
    return { id: app.id, name: app.name, enabled: app.enabled };
  });
  if (new Set(apps.map((app) => app.id)).size !== apps.length) throw new Error('Duplicate application');
  const appNames = new Map(apps.map((app) => [app.id, app.name]));

  const corrections = value.corrections.map((correction) => {
    if (!isRecord(correction)
      || !isNonEmptyString(correction.id)
      || typeof correction.before !== 'string'
      || typeof correction.after !== 'string'
      || !isNonEmptyString(correction.heard)
      || !isNonEmptyString(correction.intended)
      || !isNonEmptyString(correction.appId)
      || !isNonEmptyString(correction.createdAt)
      || Number.isNaN(Date.parse(correction.createdAt))
      || !['draft', 'approved'].includes(String(correction.status))
      || !Number.isInteger(correction.hits)
      || Number(correction.hits) < 0
      || (correction.sourceName !== undefined && !isNonEmptyString(correction.sourceName))) throw new Error('Invalid correction');
    return {
      id: correction.id,
      before: correction.before,
      after: correction.after,
      heard: correction.heard,
      intended: correction.intended,
      appId: correction.appId,
      sourceName: correction.sourceName || appNames.get(correction.appId),
      createdAt: correction.createdAt,
      status: correction.status as Correction['status'],
      hits: correction.hits as number
    };
  });
  if (new Set(corrections.map((correction) => correction.id)).size !== corrections.length) throw new Error('Duplicate correction');

  return { version: 1, apps, corrections, settings: { theme: value.settings.theme as RepairState['settings']['theme'] } };
}
