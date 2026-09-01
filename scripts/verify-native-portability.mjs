import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const cargo = read('src-tauri/Cargo.toml');
const lib = read('src-tauri/src/lib.rs');
const build = read('src-tauri/build.rs');
const claims = JSON.parse(read('.factory/claims.json'));

const requireText = (source, text, label) => {
  if (!source.includes(text)) throw new Error(`Native portability policy is missing ${label}`);
};

requireText(cargo, 'default = ["desktop"]', 'the explicit desktop default feature');
requireText(cargo, 'desktop = ["dep:arboard", "dep:tauri", "dep:tauri-plugin-opener"]', 'the isolated desktop feature');
for (const dependency of [
  'tauri = { version = "2", features = ["tray-icon"], optional = true }',
  'tauri-plugin-opener = { version = "2", optional = true }',
  'arboard = { version = "3", optional = true }'
]) requireText(cargo, dependency, `optional ${dependency.split(' ')[0]} dependency`);

requireText(lib, '#[cfg(feature = "desktop")]\nmod desktop;', 'desktop-only native module guard');
requireText(build, '#[cfg(feature = "desktop")]\n    tauri_build::build()', 'desktop-only Tauri build hook');

for (const id of ['native-erase', 'encrypted-vault', 'per-device-key']) {
  const claim = claims.find((candidate) => candidate.id === id);
  if (!claim?.test.includes('cargo test --manifest-path src-tauri/Cargo.toml --no-default-features')) {
    throw new Error(`${id} must run through the no-GUI native test command`);
  }
}

console.log(JSON.stringify({ portable: true, checked: 'manifest-and-feature-topology' }));
