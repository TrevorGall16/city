const fs = require('fs');
const path = require('path');

// 🛰️ MASTER AI: IMAGE MANIFEST GENERATOR V1.0
// Scans public/images and creates a JSON map to prevent Netlify build crashes.

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'image-manifest.json');
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function generateManifest() {
  console.log('🖼️  Generating Image Manifest...');
  const manifest = {};

  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('⚠️  Images directory not found.');
    return;
  }

  const cities = fs.readdirSync(IMAGES_DIR);

  cities.forEach(city => {
    const cityPath = path.join(IMAGES_DIR, city);
    if (!fs.statSync(cityPath).isDirectory()) return;

    const places = fs.readdirSync(cityPath);
    places.forEach(place => {
      const placePath = path.join(cityPath, place);
      if (!fs.statSync(placePath).isDirectory()) return;

      const files = fs.readdirSync(placePath)
        .filter(f => VALID_EXTENSIONS.has(path.extname(f).toLowerCase()))
        .sort();

      if (files.length > 0) {
        manifest[`${city}/${place}`] = files;
      }
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest created with ${Object.keys(manifest).length} galleries.`);
}

generateManifest();