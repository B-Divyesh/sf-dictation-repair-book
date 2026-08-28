import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createHash } from 'node:crypto';

const version = process.argv[2]?.replace(/^v/, '');
if (!version) throw new Error('version argument required');
const input = 'downloaded-artifacts';
const output = 'release-assets';
mkdirSync(output, { recursive: true });
const allFiles = (dir) => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? allFiles(path) : [path]; });
const files = allFiles(input);
const pick = (folder, extension) => files.find((file) => file.includes(folder) && file.toLowerCase().endsWith(extension.toLowerCase()));
const copies = [
  ['macos-arm64', '.dmg', 'Dictation-Repair-Book-macos-arm64.dmg'],
  ['macos-x64', '.dmg', 'Dictation-Repair-Book-macos-x64.dmg'],
  ['windows-x64', '.msi', 'Dictation-Repair-Book-windows-x64.msi'],
  ['windows-x64', '.exe', 'Dictation-Repair-Book-windows-x64.exe'],
  ['linux-x64', '.appimage', 'Dictation-Repair-Book-linux-x64.AppImage'],
  ['linux-x64', '.deb', 'Dictation-Repair-Book-linux-x64.deb']
];
for (const [folder, extension, name] of copies) {
  const source = pick(folder, extension);
  if (!source) throw new Error(`Missing ${folder} ${extension} bundle`);
  cpSync(source, join(output, name));
}
const published = readdirSync(output).sort();
const hashes = Object.fromEntries(published.map((name) => [name, createHash('sha256').update(readFileSync(join(output, name))).digest('hex')]));
writeFileSync(join(output, 'SHA256SUMS'), published.map((name) => `${hashes[name]}  ${name}`).join('\n') + '\n');
const base = 'https://github.com/B-Divyesh/sf-dictation-repair-book/releases/latest/download';
const asset = (filename) => ({ filename, url: `${base}/${filename}`, sha256: hashes[filename] });
const manifest = { version: `v${version}`, published_at: new Date().toISOString(), platforms: {
  'macos-arm64': asset('Dictation-Repair-Book-macos-arm64.dmg'),
  'macos-x64': asset('Dictation-Repair-Book-macos-x64.dmg'),
  'windows-x64': asset('Dictation-Repair-Book-windows-x64.msi'),
  'linux-x64': asset('Dictation-Repair-Book-linux-x64.AppImage')
} };
writeFileSync(join(output, 'latest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared ${published.length} bundles plus SHA256SUMS and latest.json`);
