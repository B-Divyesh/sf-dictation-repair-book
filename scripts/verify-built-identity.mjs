import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const directory = process.argv[2] || 'dist/app';
const tag = process.env.RELEASE_TAG;
const commit = process.env.RELEASE_COMMIT?.toLowerCase();

if (!tag || !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag)) {
  throw new Error('RELEASE_TAG must be a stable version such as v0.1.7');
}
if (!commit || !/^[a-f0-9]{40}$/.test(commit)) {
  throw new Error('RELEASE_COMMIT must name the exact 40-character source commit');
}

const files = readdirSync(directory, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
  .map((entry) => join(entry.parentPath, entry.name));
const payloads = files.map((file) => readFileSync(file, 'utf8'));

if (!payloads.some((payload) => payload.includes(tag) && payload.includes(commit))) {
  throw new Error(`Built webview does not carry exact identity ${tag} · ${commit}`);
}

console.log(JSON.stringify({ directory, tag, commit, verifiedJavaScriptFiles: files.length }));
