param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Front_Usuario', 'front-adm')]
    [string]$Site
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$repo = Split-Path -Parent $PSScriptRoot
$dist = (Resolve-Path (Join-Path (Join-Path $repo $Site) 'dist')).Path
$destination = Join-Path $env:TEMP 'ecowayer-deploy'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$archive = Join-Path $destination ("$Site.zip")
Remove-Item -LiteralPath $archive -Force -ErrorAction SilentlyContinue
$zip = [System.IO.Compression.ZipFile]::Open($archive, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -LiteralPath $dist -Recurse -File | ForEach-Object {
        $entry = $_.FullName.Substring($dist.Length + 1).Replace([IO.Path]::DirectorySeparatorChar, '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $_.FullName, $entry, [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
} finally {
    $zip.Dispose()
}
Write-Output $archive
