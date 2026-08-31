const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const logoPath = path.join(__dirname, '../../public/images/aura-logo.jpg');
const ogBannerPath = 'C:\\Users\\osita\\.gemini\\antigravity-ide\\brain\\47244011-fc94-446e-9975-cf6f24a1944d\\aura_og_banner_1788193014130.jpg';
const publicDir = path.join(__dirname, '../../public');

async function processImages() {
  console.log('Processing Aura Luxury brand icons & social images...');

  // 1. Generate icon-static.png (512x512 PNG)
  await sharp(logoPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-static.png'));
  console.log('✓ Created public/icon-static.png');

  // 2. Generate icon-static-32x32.png (32x32 PNG)
  await sharp(logoPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'icon-static-32x32.png'));
  console.log('✓ Created public/icon-static-32x32.png');

  // 3. Generate favicon.ico (using 32x32 PNG buffer / format)
  // Sharp can generate raw ICO or 32x32 PNG saved as icon / favicon
  await sharp(logoPath)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ Created public/favicon.ico');

  // 4. Generate og-image.jpg (1200x630 JPEG)
  await sharp(ogBannerPath)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('✓ Created public/og-image.jpg');

  // 5. Generate og-image.png (1200x630 PNG)
  await sharp(ogBannerPath)
    .resize(1200, 630, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ Created public/og-image.png');

  console.log('All brand assets successfully generated and replaced!');
}

processImages().catch((err) => {
  console.error('Error generating brand icons:', err);
  process.exit(1);
});
