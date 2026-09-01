import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// @claim:powershell-checksum-installer

const root = fileURLToPath(new URL('..', import.meta.url));
const installer = readFileSync(join(root, 'public/install.ps1'), 'utf8');
const file = 'Dictation-Repair-Book-windows-x64.msi';

function checksumFor(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

function checksumFromSums(sums) {
  const line = sums.split(/\r?\n/).find((entry) => {
    const fields = entry.trim().split(/\s+/);
    return fields.length >= 2 && fields.at(-1) === file;
  });
  assert.ok(line, `No checksum published for ${file}`);
  return line.trim().split(/\s+/)[0].toLowerCase();
}

function verifyBeforeLaunch(target, sums, launch) {
  const expected = checksumFromSums(readFileSync(sums, 'utf8'));
  const actual = checksumFor(readFileSync(target));
  if (expected !== actual) {
    unlinkSync(target);
    throw new Error('Checksum mismatch; refusing to install.');
  }
  launch();
}

function assertPowerShellControlFlow() {
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

const temp = mkdtempSync(join(tmpdir(), 'drb-installer-contract-'));
try {
  assertPowerShellControlFlow();

  const matchingTarget = join(temp, file);
  const matchingSums = join(temp, 'matching-SHA256SUMS');
  const packageContents = Buffer.from('fixture package');
  writeFileSync(matchingTarget, packageContents);
  writeFileSync(matchingSums, `${checksumFor(packageContents)}  ${file}\n`);
  let started = false;
  verifyBeforeLaunch(matchingTarget, matchingSums, () => { started = true; });
  assert.equal(started, true, 'a package with the published checksum should launch the MSI');

  const mismatchedTarget = join(temp, `mismatched-${file}`);
  const mismatchedSums = join(temp, 'mismatched-SHA256SUMS');
  writeFileSync(mismatchedTarget, packageContents);
  writeFileSync(mismatchedSums, `${'0'.repeat(64)}  ${file}\n`);
  started = false;
  assert.throws(() => verifyBeforeLaunch(mismatchedTarget, mismatchedSums, () => { started = true; }), /Checksum mismatch; refusing to install\./);
  assert.equal(started, false, 'a mismatched package must not launch the MSI');
  assert.throws(() => readFileSync(mismatchedTarget), { code: 'ENOENT' }, 'a mismatched package must be removed');

  console.log('Windows installer checksum match and mismatch contracts passed.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
