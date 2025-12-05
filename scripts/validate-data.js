/**
 * Data Validation Script
 * Validates all JSON files against Zod schemas
 * Fails build if any validation errors
 * Run via: npm run validate
 */

const fs = require('fs')
const path = require('path')
const { z } = require('zod')

// Define Zod schemas matching TypeScript interfaces
const PlaceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  name_en: z.string().min(1),
  name_local: z.string().min(1),
  category: z.enum(['food', 'sight']),
  description: z.string().min(1).max(1000), // Increased for cultural descriptions
  image: z.string().url(),
  is_generic_staple: z.boolean(),
  geo: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(), // geo is now optional for generic staples
})

const CitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  name: z.string().min(1),
  country: z.string().min(1),
  hero_image: z.string().url(),
  intro_vibe: z.string().min(1).max(200),
  general_info: z.object({
    population: z.string().min(1),
    is_capital: z.boolean(),
    description: z.string().min(1),
  }),
  stats: z.object({
    currency: z.string().min(1),
    plug_type: z.string().min(1),
    best_time: z.string().min(1),
  }),
  logistics: z.object({
    safety: z.array(z.string()),
    scams: z.array(z.string()),
    transit: z.array(z.string()),
  }),
  must_eat: z.array(PlaceSchema),
  must_see: z.array(PlaceSchema),
})

async function validateData() {
  console.log('🔍 Validating data files...\n')

  const citiesDir = path.join(process.cwd(), 'src/data/cities')

  // Check if directory exists
  if (!fs.existsSync(citiesDir)) {
    console.error('❌ Cities directory not found:', citiesDir)
    process.exit(1)
  }

  const files = fs.readdirSync(citiesDir).filter(f => f.endsWith('.json'))

  if (files.length === 0) {
    console.error('❌ No city files found in', citiesDir)
    process.exit(1)
  }

  let errors = 0
  let warnings = 0

  for (const file of files) {
    const filePath = path.join(citiesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    let data
    try {
      data = JSON.parse(content)
    } catch (error) {
      console.error(`❌ ${file}: Invalid JSON`)
      console.error(`   ${error.message}\n`)
      errors++
      continue
    }

    // Validate against schema
    const result = CitySchema.safeParse(data)

    if (!result.success) {
      console.error(`❌ ${file}: Validation failed`)
      result.error.errors.forEach(err => {
        console.error(`   ${err.path.join('.')}: ${err.message}`)
      })
      console.error('')
      errors++
    } else {
      console.log(`✅ ${file}`)

      // Additional checks
      const city = result.data

      // Check for duplicate place slugs
      const allPlaces = [...city.must_eat, ...city.must_see]
      const slugs = allPlaces.map(p => p.slug)
      const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
      if (duplicates.length > 0) {
        console.warn(`   ⚠️  Duplicate place slugs: ${duplicates.join(', ')}`)
        warnings++
      }

      // Check for duplicate place IDs
      const ids = allPlaces.map(p => p.id)
      const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i)
      if (duplicateIds.length > 0) {
        console.warn(`   ⚠️  Duplicate place IDs: ${duplicateIds.join(', ')}`)
        warnings++
      }

      // Check slug matches filename
      const expectedSlug = file.replace('.json', '')
      if (city.slug !== expectedSlug) {
        console.warn(`   ⚠️  Slug mismatch: file is "${file}" but slug is "${city.slug}"`)
        warnings++
      }
    }
  }

  console.log('')
  console.log('─'.repeat(50))

  if (errors === 0 && warnings === 0) {
    console.log('✅ All data files are valid!')
    console.log(`   Validated ${files.length} city files`)
    process.exit(0)
  } else {
    if (errors > 0) {
      console.error(`❌ Validation failed with ${errors} error(s)`)
    }
    if (warnings > 0) {
      console.warn(`⚠️  Found ${warnings} warning(s)`)
    }

    if (errors > 0) {
      process.exit(1)
    } else {
      // Warnings don't fail the build
      console.log('✅ Validation passed (with warnings)')
      process.exit(0)
    }
  }
}

validateData()
