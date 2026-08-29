import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tag = process.argv[2];
if (!tag || !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag)) {
  throw new Error('release tag must be a stable version such as v0.1.3');
}

const version = tag.slice(1);
const packageVersion = JSON.parse(readFileSync('package.json', 'utf8')).version;
const tauriVersion = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8')).version;
const cargo = readFileSync('src-tauri/Cargo.toml', 'utf8');
const cargoVersion = cargo.match(/^\[package\][\s\S]*?^version = "([^"]+)"/m)?.[1];

for (const [name, actual] of [['package.json', packageVersion], ['src-tauri/tauri.conf.json', tauriVersion], ['src-tauri/Cargo.toml', cargoVersion]]) {
  if (actual !== version) throw new Error(`${name} is ${actual ?? 'missing'}, but ${tag} requires ${version}`);
}

const resolveCommit = (ref) => execFileSync('git', ['rev-parse', `${ref}^{commit}`], { encoding: 'utf8' }).trim();
const tagCommit = resolveCommit(tag);
const headCommit = resolveCommit('HEAD');
if (tagCommit !== headCommit) throw new Error(`Refusing to publish ${tag} from ${headCommit}; ${tag} points to ${tagCommit}`);

console.log(JSON.stringify({ tag, version, commit: headCommit }));
