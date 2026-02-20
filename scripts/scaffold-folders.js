/**
 * Gallery Folder Scaffolder
 *
 * Creates a folder under public/images/{city}/{placeSlug}/ for every place
 * found in the city's English JSON file. The source image is read directly
 * from the `image` property on each place object — no guessing from the slug.
 * The file is COPIED (not moved) into the new folder, keeping its original
 * filename, so existing JSON references on the live site remain valid.
 *
 * Usage:
 *   node scripts/scaffold-folders.js <citySlug>
 *   node scripts/scaffold-folders.js --all
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'src', 'data', 'cities')
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Walk every place-like section of a city JSON and return
 * { slug, image } pairs. Unknown image strings are skipped.
 */
function extractPlaces(city) {
  const places = []

  function collect(item) {
    if (item && item.slug && item.image) {
      places.push({ slug: item.slug, image: item.image })
    }
  }

  // must_eat — flat array
  if (Array.isArray(city.must_eat)) {
    city.must_eat.forEach(collect)
  }

  // must_see — nested: [{ items: Place[] }]
  if (Array.isArray(city.must_see)) {
    for (const group of city.must_see) {
      if (Array.isArray(group.items)) {
        group.items.forEach(collect)
      }
    }
  }

  // micro-collections
  for (const key of ['best_coffee', 'best_bakeries', 'where_to_stay', 'cheap_eats']) {
    if (Array.isArray(city[key])) {
      city[key].forEach(collect)
    }
  }

  // Deduplicate by slug (keep first occurrence)
  const seen = new Set()
  return places.filter(({ slug }) => {
    if (seen.has(slug)) return false
    seen.add(slug)
    return true
  })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function scaffoldCity(citySlug) {
  const jsonPath = path.join(DATA_DIR, `${citySlug}.json`)
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌  Data file not found: ${jsonPath}`)
    return { created: 0, copied: 0, skipped: 0, missing: 0 }
  }

  const city = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const places = extractPlaces(city)

  if (places.length === 0) {
    console.warn(`⚠️   No places found in ${citySlug}.json`)
    return { created: 0, copied: 0, skipped: 0, missing: 0 }
  }

  const cityImgDir = path.join(PUBLIC_IMAGES, citySlug)
  if (!fs.existsSync(cityImgDir)) {
    fs.mkdirSync(cityImgDir, { recursive: true })
  }

  let created = 0
  let copied = 0
  let skipped = 0
  let missing = 0

  // Stale filenames left by previous script runs that used wrong names
  const GARBAGE_NAMES = ['1.jpg', 'hero.jpg', 'hero.jpeg', 'hero.png', 'hero.webp']

  for (const { slug, image } of places) {
    const folderPath = path.join(cityImgDir, slug)
    const relFolder = path.relative(ROOT, folderPath).replace(/\\/g, '/')

    // Resolve the source file from the JSON `image` path (absolute URL → disk path)
    // e.g.  "/images/berlin/currywurst.jpg"  →  public/images/berlin/currywurst.jpg
    const srcRelative = image.startsWith('/') ? image.slice(1) : image
    const srcFile = path.join(ROOT, 'public', srcRelative)
    const srcBasename = path.basename(srcFile)
    const destFile = path.join(folderPath, srcBasename)

    // ------------------------------------------------------------------
    // 1. Create the folder if it doesn't exist yet
    // ------------------------------------------------------------------
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
      created++
    }

    // ------------------------------------------------------------------
    // 2. Clean up garbage files left by previous bad script runs
    // ------------------------------------------------------------------
    for (const name of GARBAGE_NAMES) {
      const stale = path.join(folderPath, name)
      if (fs.existsSync(stale)) {
        fs.unlinkSync(stale)
        console.log(`🗑️   Removed stale file: ${relFolder}/${name}`)
      }
    }

    // ------------------------------------------------------------------
    // 3. Skip if the correctly-named file already exists
    // ------------------------------------------------------------------
    if (fs.existsSync(destFile)) {
      console.log(`⏭️   Already exists: ${relFolder}/${srcBasename}`)
      skipped++
      continue
    }

    // ------------------------------------------------------------------
    // 4. Verify the source image exists before copying
    // ------------------------------------------------------------------
    if (!fs.existsSync(srcFile)) {
      console.warn(`⚠️   Source not found — skipping: ${image}`)
      missing++
      continue
    }

    // ------------------------------------------------------------------
    // 5. COPY (never move) into the folder, keeping the original filename
    // ------------------------------------------------------------------
    fs.copyFileSync(srcFile, destFile)
    console.log(`✅  Copied ${srcBasename} → ${relFolder}/${srcBasename}`)
    copied++
  }

  return { created, copied, skipped, missing }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const arg = process.argv[2]

if (!arg) {
  console.error('Usage: node scripts/scaffold-folders.js <citySlug>')
  console.error('       node scripts/scaffold-folders.js --all')
  process.exit(1)
}

if (arg === '--all') {
  // English-only files: no hyphenated language suffix (e.g. berlin.json, not berlin-de.json)
  // Cities with hyphens in their slug (hong-kong, rio-de-janeiro) have two or more segments,
  // so we exclude only files whose last hyphen-separated segment is a known 2-letter lang code.
  const LANG_CODES = new Set(['ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'])

  const files = fs.readdirSync(DATA_DIR)
    .filter((f) => {
      if (!f.endsWith('.json')) return false
      if (f.startsWith('bckup')) return false
      const stem = f.replace('.json', '')
      const parts = stem.split('-')
      const lastPart = parts[parts.length - 1]
      return !LANG_CODES.has(lastPart)
    })
    .map((f) => f.replace('.json', ''))

  let totalCreated = 0
  let totalCopied = 0
  let totalSkipped = 0
  let totalMissing = 0

  for (const citySlug of files) {
    console.log(`\n🏙️   ${citySlug}`)
    console.log('─'.repeat(40))
    const { created, copied, skipped, missing } = scaffoldCity(citySlug)
    totalCreated += created
    totalCopied += copied
    totalSkipped += skipped
    totalMissing += missing
  }

  console.log(`\n${'═'.repeat(40)}`)
  console.log(`📊  Total: ${totalCreated} folders created, ${totalCopied} images copied, ${totalSkipped} already done, ${totalMissing} source files missing`)
} else {
  console.log(`\n🏙️   Scaffolding gallery folders for: ${arg}`)
  console.log('─'.repeat(40))
  const { created, copied, skipped, missing } = scaffoldCity(arg)
  console.log(`\n📊  Done: ${created} folders created, ${copied} images copied, ${skipped} already done, ${missing} source files missing`)
}
