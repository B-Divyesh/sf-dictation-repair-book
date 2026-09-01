import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const tag = process.argv[2];
const directory = process.argv[3] || 'release-assets';
if (!tag || !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag)) {
  throw new Error('release tag must be a stable version such as v0.1.10');
}

const expectedCommit = process.env.RELEASE_COMMIT?.toLowerCase();
if (!expectedCommit || !/^[a-f0-9]{40}$/.test(expectedCommit)) {
  throw new Error('RELEASE_COMMIT must name the exact 40-character source commit');
}

const required = [
  'Dictation-Repair-Book-macos-arm64.dmg',
  'Dictation-Repair-Book-macos-x64.dmg',
  'Dictation-Repair-Book-windows-x64.msi',
  'Dictation-Repair-Book-windows-x64.exe',
  'Dictation-Repair-Book-linux-x64.AppImage',
  'Dictation-Repair-Book-linux-x64.deb'
];
const assetPath = (name) => join(directory, name);
for (const filename of required) {
  if (!existsSync(assetPath(filename))) throw new Error(`Missing required release asset ${filename}`);
}

const latest = JSON.parse(readFileSync(assetPath('latest.json'), 'utf8'));
const buildInfo = JSON.parse(readFileSync(assetPath('build-info.json'), 'utf8'));
for (const [name, manifest] of [['latest.json', latest], ['build-info.json', buildInfo]]) {
  if (manifest.version !== tag) throw new Error(`${name} is ${manifest.version ?? 'missing'}, expected ${tag}`);
  if (manifest.commit !== expectedCommit) throw new Error(`${name} commit ${manifest.commit ?? 'missing'} does not match source ${expectedCommit}`);
}

const checksums = new Map(readFileSync(assetPath('SHA256SUMS'), 'utf8').trim().split('\n').map((line) => {
  const match = line.match(/^([a-f0-9]{64}) {2}(.+)$/);
  if (!match) throw new Error(`Invalid SHA256SUMS line: ${line}`);
  return [match[2], match[1]];
}));
for (const filename of required) {
  const actual = createHash('sha256').update(readFileSync(assetPath(filename))).digest('hex');
  if (checksums.get(filename) !== actual) throw new Error(`SHA256SUMS does not match ${filename}`);
}

const published = readdirSync(directory).sort();
if (!Array.isArray(buildInfo.artifacts) || [...buildInfo.artifacts].sort().join('\n') !== required.slice().sort().join('\n')) {
  throw new Error('build-info.json must list exactly the six bundled desktop artifacts');
}
if (!published.includes('SHA256SUMS') || !published.includes('latest.json') || !published.includes('build-info.json')) {
  throw new Error('Release metadata files are missing');
}

console.log(JSON.stringify({ tag, commit: expectedCommit, verified: required.length }));
