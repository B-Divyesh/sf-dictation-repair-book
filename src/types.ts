export type AppScope = { id: string; name: string; enabled: boolean };
export type Correction = {
  id: string;
  before: string;
  after: string;
  heard: string;
  intended: string;
  appId: string;
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
