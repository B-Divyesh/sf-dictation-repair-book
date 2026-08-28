$ErrorActionPreference = "Stop"
$base = "https://github.com/B-Divyesh/sf-dictation-repair-book/releases/latest/download"
$file = "Dictation-Repair-Book-windows-x64.msi"
$target = Join-Path $env:TEMP $file
$sums = Join-Path $env:TEMP "Dictation-Repair-Book-SHA256SUMS"
Invoke-WebRequest "$base/$file" -OutFile $target
Invoke-WebRequest "$base/SHA256SUMS" -OutFile $sums
$line = Get-Content $sums | Where-Object { $_ -match "\s+$([regex]::Escape($file))$" } | Select-Object -First 1
if (-not $line) { throw "No checksum published for $file" }
$expected = ($line -split "\s+")[0].ToLowerInvariant()
$actual = (Get-FileHash -Algorithm SHA256 $target).Hash.ToLowerInvariant()
if ($expected -ne $actual) { Remove-Item $target; throw "Checksum mismatch; refusing to install." }
Write-Host "Verified SHA256. Starting the unsigned Windows installer..."
Start-Process msiexec.exe -ArgumentList "/i `"$target`"" -Wait
Write-Host "Dictation Repair Book installer finished. Windows may show an unsigned-publisher warning on first launch."
