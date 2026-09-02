$ErrorActionPreference = "Stop"

# @claim:powershell-checksum-installer
# This executable fixture invokes the shipped PowerShell installer with isolated
# matching, mismatching, and missing-checksum downloads.

$root = Split-Path -Parent $PSScriptRoot
$installer = Join-Path $root "public/install.ps1"
$file = "Dictation-Repair-Book-windows-x64.msi"
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ("drb-powershell-test-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $tempRoot | Out-Null
$originalTemp = $env:TEMP
$env:TEMP = $tempRoot

function Invoke-InstallerFixture([string]$Mode) {
  $global:drbFixtureMode = $Mode
  $global:drbStarted = $false
  $global:drbLaunch = $null
  Remove-Item (Join-Path $tempRoot $file) -ErrorAction SilentlyContinue
  Remove-Item (Join-Path $tempRoot "Dictation-Repair-Book-SHA256SUMS") -ErrorAction SilentlyContinue
  function global:Invoke-WebRequest {
    param([string]$Uri, [string]$OutFile)
    if ($Uri -like "*SHA256SUMS") {
      $package = [Text.Encoding]::UTF8.GetBytes("fixture package")
      $hash = if ($global:drbFixtureMode -eq "Match") { ([Security.Cryptography.SHA256]::Create().ComputeHash($package) | ForEach-Object { $_.ToString("x2") }) -join "" } else { "0" * 64 }
      $listedFile = if ($global:drbFixtureMode -eq "Missing") { "Different-Package.msi" } else { $file }
      [IO.File]::WriteAllText($OutFile, "$hash  $listedFile`n")
    } else {
      [IO.File]::WriteAllText($OutFile, "fixture package")
    }
  }
  function global:Start-Process {
    param($FilePath, $ArgumentList, [switch]$Wait)
    $global:drbStarted = $true
    $global:drbLaunch = @{ FilePath = $FilePath; ArgumentList = $ArgumentList; Wait = $Wait.IsPresent }
  }
  try { & $installer } catch {
    return @{ Error = $_.Exception.Message; Started = $global:drbStarted; TargetExists = Test-Path (Join-Path $tempRoot $file); Launch = $global:drbLaunch }
  }
  return @{ Error = $null; Started = $global:drbStarted; TargetExists = Test-Path (Join-Path $tempRoot $file); Launch = $global:drbLaunch }
}

try {
  $mismatch = Invoke-InstallerFixture "Mismatch"
  if ($mismatch.Error -notmatch "Checksum mismatch; refusing to install.") { throw "Mismatch did not refuse the package: $($mismatch.Error)" }
  if ($mismatch.Started) { throw "Mismatch invoked the MSI launcher" }
  if ($mismatch.TargetExists) { throw "Mismatch left the downloaded package on disk" }
  $missing = Invoke-InstallerFixture "Missing"
  if ($missing.Error -notmatch "No checksum published") { throw "Missing checksum did not refuse the package: $($missing.Error)" }
  if ($missing.Started) { throw "Missing checksum invoked the MSI launcher" }
  $match = Invoke-InstallerFixture "Match"
  if ($match.Error) { throw "Matching package failed: $($match.Error)" }
  if (-not $match.Started) { throw "Matching package did not invoke the MSI launcher" }
  if ($match.Launch.FilePath -ne "msiexec.exe" -or -not $match.Launch.Wait) { throw "Matching package used the wrong MSI launch contract" }
  if ($match.Launch.ArgumentList -notmatch [regex]::Escape($file)) { throw "Matching package did not pass the verified MSI to the launcher" }
  Write-Host "PowerShell installer checksum match, mismatch, and missing-checksum paths passed."
} finally {
  Remove-Item Function:\global:Invoke-WebRequest -ErrorAction SilentlyContinue
  Remove-Item Function:\global:Start-Process -ErrorAction SilentlyContinue
  Remove-Variable drbFixtureMode -Scope Global -ErrorAction SilentlyContinue
  Remove-Variable drbStarted -Scope Global -ErrorAction SilentlyContinue
  Remove-Variable drbLaunch -Scope Global -ErrorAction SilentlyContinue
  $env:TEMP = $originalTemp
  Remove-Item -Recurse -Force $tempRoot -ErrorAction SilentlyContinue
}
