import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const installer = readFileSync(join(root, 'public/install.ps1'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const releaseWorkflow = readFileSync(join(root, '.github/workflows/release.yml'), 'utf8');
const qualityWorkflow = readFileSync(join(root, '.github/workflows/quality.yml'), 'utf8');

// @claim:powershell-checksum-installer
function assertPowerShellStructure() {
  for (const expression of [
    'Invoke-WebRequest "$base/$file" -OutFile $target',
    'Invoke-WebRequest "$base/SHA256SUMS" -OutFile $sums',
    'Where-Object { $_ -match "\\s+$([regex]::Escape($file))$" }',
    'Get-FileHash -Algorithm SHA256 $target',
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
  assert.equal(packageJson.scripts['test:installer-windows'], 'pwsh -NoLogo -NoProfile -File tests/installers.ps1');
  assert.ok(!packageJson.scripts.test.includes('test:installer-windows'), 'portable npm test must not require PowerShell');
  assert.match(qualityWorkflow, /runs-on: windows-latest[\s\S]*npm run test:installer-windows/,
    'quality CI must execute the shipped PowerShell installer fixture on Windows');
  assert.match(releaseWorkflow, /os: windows-latest[\s\S]*if: matrix\.os == 'windows-latest'[\s\S]*npm run test:installer-windows/,
    'release CI must execute the shipped PowerShell installer fixture on Windows');
}

assertPowerShellStructure();
console.log('Portable PowerShell installer contract passed; Windows CI executes the match, mismatch, and missing-checksum paths.');
