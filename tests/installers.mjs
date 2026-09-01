import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const installer = readFileSync(join(root, 'public/install.ps1'), 'utf8');

function assertPowerShellStructure() {
  for (const expression of [
    'Invoke-WebRequest "$base/$file" -OutFile $target',
    'Invoke-WebRequest "$base/SHA256SUMS" -OutFile $sums',
    'Get-FileHash -Algorithm SHA256 $target',
    'Remove-Item $target',
    'Checksum mismatch; refusing to install.',
    'Start-Process msiexec.exe'
  ]) assert.ok(installer.includes(expression), `install.ps1 is missing ${expression}`);

  const hash = installer.indexOf('Get-FileHash -Algorithm SHA256 $target');
  const refusal = installer.indexOf('if ($expected -ne $actual)');
  const removal = installer.indexOf('Remove-Item $target');
  const launch = installer.indexOf('Start-Process msiexec.exe');
  assert.ok(hash < refusal && refusal < removal && removal < launch, 'install.ps1 must remove a mismatched package before launching MSI');
}

assertPowerShellStructure();
console.log('PowerShell installer static smoke check passed. The executable checksum claim runs tests/installers.ps1.');
