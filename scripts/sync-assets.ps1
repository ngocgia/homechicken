$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $projectRoot "public"
$dest = Join-Path $projectRoot "android\app\src\main\assets\public"

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
}

Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force
Write-Host "Sync completed successfully from $source to $dest"
