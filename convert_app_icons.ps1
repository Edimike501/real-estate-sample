Add-Type -AssemblyName System.Drawing;

$logoPath = "c:\Users\osita\Documents\GitHub\real-estate-sample\public\images\aura-logo.jpg"
$appDir = "c:\Users\osita\Documents\GitHub\real-estate-sample\app"

$fmtPng = [System.Drawing.Imaging.ImageFormat]::Png

function Resize-Image($srcPath, $destPath, $width, $height, $format) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($srcImg, 0, 0, $width, $height)
    $bmp.Save($destPath, $format)
    $graph.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
}

Write-Host "Creating app/icon.png (512x512)..."
Resize-Image $logoPath (Join-Path $appDir "icon.png") 512 512 $fmtPng

Write-Host "Creating app/apple-icon.png (180x180)..."
Resize-Image $logoPath (Join-Path $appDir "apple-icon.png") 180 180 $fmtPng

Write-Host "APP_ICONS_SUCCESS"
