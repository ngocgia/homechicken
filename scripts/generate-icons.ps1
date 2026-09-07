Add-Type -AssemblyName System.Drawing

$sourcePath = "d:\homechicken\google_play_assets\app_icon_512.png"
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source icon not found: $sourcePath"
    exit 1
}

$src = [System.Drawing.Image]::FromFile($sourcePath)

$sizes = @(
    @{ Folder = "mipmap-mdpi"; Size = 48 },
    @{ Folder = "mipmap-hdpi"; Size = 72 },
    @{ Folder = "mipmap-xhdpi"; Size = 96 },
    @{ Folder = "mipmap-xxhdpi"; Size = 144 },
    @{ Folder = "mipmap-xxxhdpi"; Size = 192 }
)

foreach ($item in $sizes) {
    $folderName = $item.Folder
    $targetDir = "d:\homechicken\android\app\src\main\res\$folderName"
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }
    
    $sz = $item.Size
    $bmp = New-Object System.Drawing.Bitmap $sz, $sz
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $sz, $sz)
    
    $squarePath = Join-Path $targetDir "ic_launcher.png"
    $roundPath = Join-Path $targetDir "ic_launcher_round.png"
    
    $bmp.Save($squarePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created icons for $folderName ($sz x $sz)"
}

$src.Dispose()
Write-Host "All Android icons generated successfully!"
