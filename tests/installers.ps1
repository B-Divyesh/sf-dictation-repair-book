$ErrorActionPreference = "Stop"

# The portable claim test lives in installers.mjs. This fixture still runs in Windows CI.

$root = Split-Path -Parent $PSScriptRoot
$installer = Join-Path $root "public/install.ps1"
$file = "Dictation-Repair-Book-windows-x64.msi"
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ("drb-powershell-test-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $tempRoot | Out-Null
$originalTemp = $env:TEMP
$env:TEMP = $tempRoot

function Invoke-InstallerFixture([bool]$Match) {
  $global:drbStarted = $false
  function global:Invoke-WebRequest {
    param([string]$Uri, [string]$OutFile)
    if ($Uri -like "*SHA256SUMS") {
      $package = [Text.Encoding]::UTF8.GetBytes("fixture package")
      $hash = if ($Match) { ([Security.Cryptography.SHA256]::Create().ComputeHash($package) | ForEach-Object { $_.ToString("x2") }) -join "" } else { "0" * 64 }
      [IO.File]::WriteAllText($OutFile, "$hash  $file`n")
    } else {
      [IO.File]::WriteAllText($OutFile, "fixture package")
    }
  }
  function global:Start-Process { param($FilePath, $ArgumentList, [switch]$Wait) $global:drbStarted = $true }
  try { & $installer } catch { return @{ Error = $_.Exception.Message; Started = $global:drbStarted } }
  return @{ Error = $null; Started = $global:drbStarted }
}

try {
  $mismatch = Invoke-InstallerFixture $false
  if ($mismatch.Error -notmatch "Checksum mismatch; refusing to install.") { throw "Mismatch did not refuse the package: $($mismatch.Error)" }
  if ($mismatch.Started) { throw "Mismatch invoked the MSI launcher" }
  $match = Invoke-InstallerFixture $true
  if ($match.Error) { throw "Matching package failed: $($match.Error)" }
  if (-not $match.Started) { throw "Matching package did not invoke the MSI launcher" }
  Write-Host "PowerShell installer checksum match and mismatch paths passed."
} finally {
  Remove-Item Function:\global:Invoke-WebRequest -ErrorAction SilentlyContinue
  Remove-Item Function:\global:Start-Process -ErrorAction SilentlyContinue
  $env:TEMP = $originalTemp
  Remove-Item -Recurse -Force $tempRoot -ErrorAction SilentlyContinue
}
