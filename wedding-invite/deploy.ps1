$src = Split-Path -Parent $MyInvocation.MyCommand.Path
$zip = Join-Path (Split-Path -Parent $src) "wedding-invite-site.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($src, $zip, [System.IO.Compression.CompressionLevel]::Optimal, $false)
[System.IO.Compression.ZipFile]::OpenRead($zip).Entries | ForEach-Object { $_.FullName }
