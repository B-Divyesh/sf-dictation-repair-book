import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const installer = readFileSync(join(root, 'public/install.ps1'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const releaseWorkflow = readFileSync(join(root, '.github/workflows/release.yml'), 'utf8');
const qualityWorkflow = readFileSync(join(root, '.github/workflows/quality.yml'), 'utf8');
const packageName = 'Dictation-Repair-Book-windows-x64.msi';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertPowerShellImplementation() {
  for (const expression of [
    'Invoke-WebRequest "$base/$file" -OutFile $target',
    'Invoke-WebRequest "$base/SHA256SUMS" -OutFile $sums',
    'Where-Object { $_ -match "\\s+$([regex]::Escape($file))$" }',
    '$expected = ($line -split "\\s+")[0].ToLowerInvariant()',
    'Get-FileHash -Algorithm SHA256 $target',
    'if ($expected -ne $actual)',
    'Remove-Item $target',
    'Checksum mismatch; refusing to install.',
    'Start-Process msiexec.exe',
    '-ArgumentList "/i `"$target`"" -Wait'
  ]) assert.ok(installer.includes(expression), `install.ps1 is missing ${expression}`);

  const packageDownload = installer.indexOf('Invoke-WebRequest "$base/$file" -OutFile $target');
  const checksumDownload = installer.indexOf('Invoke-WebRequest "$base/SHA256SUMS" -OutFile $sums');
  const expected = installer.indexOf('$expected = ($line -split "\\s+")[0].ToLowerInvariant()');
  const hash = installer.indexOf('Get-FileHash -Algorithm SHA256 $target');
  const refusal = installer.indexOf('if ($expected -ne $actual)');
  const removal = installer.indexOf('Remove-Item $target');
  const launch = installer.indexOf('Start-Process msiexec.exe');
  assert.ok(
    packageDownload < checksumDownload && checksumDownload < expected && expected < hash
      && hash < refusal && refusal < removal && removal < launch,
    'install.ps1 must download the package and checksum, compare SHA-256, remove a mismatch, and only then launch MSI'
  );

  assert.equal(packageJson.scripts['test:installer-contract'], 'node tests/installers.mjs');
  assert.equal(packageJson.scripts['test:installer-windows-portable'], 'node tests/installers.mjs');
  assert.equal(packageJson.scripts['test:installer-windows'], 'pwsh -NoLogo -NoProfile -File tests/installers.ps1');
  assert.ok(!packageJson.scripts.test.includes('test:installer-windows'), 'portable npm test must not require PowerShell');
  assert.match(qualityWorkflow, /runs-on: windows-latest[\s\S]*npm run test:installer-windows/,
    'quality CI must execute the shipped PowerShell installer fixture on Windows');
  assert.match(releaseWorkflow, /os: windows-latest[\s\S]*if: matrix\.os == 'windows-latest'[\s\S]*npm run test:installer-windows/,
    'release CI must execute the shipped PowerShell installer fixture on Windows');
}

function runPortableChecksumFixture({ checksum, listedFile = packageName }) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'drb-windows-installer-'));
  const target = join(fixtureRoot, packageName);
  const sums = join(fixtureRoot, 'SHA256SUMS');
  const packageBytes = Buffer.from('fixture Windows installer package');
  let launch = null;

  writeFileSync(target, packageBytes);
  writeFileSync(sums, `${checksum}  ${listedFile}\r\n`);

  try {
    // This is the portable equivalent of install.ps1's checksum path. The
    // assertions above bind these exercised steps to the shipped PowerShell
    // commands and their order; Windows CI additionally executes that script.
    const line = readFileSync(sums, 'utf8').split(/\r?\n/)
      .find((candidate) => new RegExp(`\\s+${escapeRegExp(packageName)}$`).test(candidate));
    if (!line) throw new Error('No checksum published for Dictation-Repair-Book-windows-x64.msi');
    const expected = line.trim().split(/\s+/)[0].toLowerCase();
    const actual = sha256(readFileSync(target));
    if (expected !== actual) {
      rmSync(target, { force: true });
      throw new Error('Checksum mismatch; refusing to install.');
    }
    launch = { filePath: 'msiexec.exe', argumentList: `/i "${target}"`, wait: true };
    return { error: null, launch, targetExists: existsSync(target) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error), launch, targetExists: existsSync(target) };
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

function assertPortableChecksumBehavior() {
  const matching = runPortableChecksumFixture({ checksum: sha256(Buffer.from('fixture Windows installer package')) });
  assert.equal(matching.error, null, 'a matching package must proceed to MSI launch');
  assert.equal(matching.launch?.filePath, 'msiexec.exe');
  assert.match(matching.launch?.argumentList ?? '', /^\/i ".+Dictation-Repair-Book-windows-x64\.msi"$/);
  assert.equal(matching.launch?.wait, true, 'a verified package must wait for the MSI process');
  assert.equal(matching.targetExists, true, 'a verified package remains available for the MSI launcher');

  const mismatch = runPortableChecksumFixture({ checksum: '0'.repeat(64) });
  assert.equal(mismatch.error, 'Checksum mismatch; refusing to install.');
  assert.equal(mismatch.launch, null, 'a mismatched package must never launch MSI');
  assert.equal(mismatch.targetExists, false, 'a mismatched package must be removed');

  const missing = runPortableChecksumFixture({ checksum: sha256(Buffer.from('fixture Windows installer package')), listedFile: 'Different-Package.msi' });
  assert.equal(missing.error, 'No checksum published for Dictation-Repair-Book-windows-x64.msi');
  assert.equal(missing.launch, null, 'a package without a published checksum must never launch MSI');
}

assertPowerShellImplementation();
// @claim:powershell-checksum-installer
assertPortableChecksumBehavior();
console.log('Portable Windows installer checksum match, mismatch, and missing-checksum paths passed; Windows CI also executes install.ps1.');
