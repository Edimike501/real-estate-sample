Add-Type -AssemblyName System.Drawing;

$logoPath = "c:\Users\osita\Documents\GitHub\real-estate-sample\public\images\aura-logo.jpg"
$ogBannerPath = "C:\Users\osita\.gemini\antigravity-ide\brain\47244011-fc94-446e-9975-cf6f24a1944d\aura_og_banner_1788193014130.jpg"
$publicDir = "c:\Users\osita\Documents\GitHub\real-estate-sample\public"

$fmtPng = [System.Drawing.Imaging.ImageFormat]::Png
$fmtIcon = [System.Drawing.Imaging.ImageFormat]::Icon

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

Write-Host "Creating public/icon-static.png..."
Resize-Image $logoPath (Join-Path $publicDir "icon-static.png") 512 512 $fmtPng

Write-Host "Creating public/icon-static-32x32.png..."
Resize-Image $logoPath (Join-Path $publicDir "icon-static-32x32.png") 32 32 $fmtPng

Write-Host "Creating public/favicon.ico..."
Resize-Image $logoPath (Join-Path $publicDir "favicon.ico") 32 32 $fmtIcon

Write-Host "Replacing public/og-image.jpg..."
Copy-Item $ogBannerPath (Join-Path $publicDir "og-image.jpg") -Force

Write-Host "Creating public/og-image.png..."
Resize-Image $ogBannerPath (Join-Path $publicDir "og-image.png") 1200 630 $fmtPng

Write-Host "ALL_SUCCESS"
