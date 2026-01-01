/**
 * ✅ MASTER AI DATA VALIDATOR - FINAL STABLE VERSION
 * Fixes the "TypeError" and supports all city data formats.
 */

const fs = require('fs')
const path = require('path')
const { z } = require('zod')

// 1. Flexible Description Schema (String or Object)
const DescriptionSchema = z.union([
  z.string().min(1).max(5000), 
  z.object({                   
    short: z.string().min(1),
    history: z.string().optional(),
    insider_tip: z.string().optional(),
    price_level: z.string().optional(),
    duration: z.string().optional(),
    best_time: z.string().optional(),
    vibe: z.string().optional(),
    good_for: z.array(z.string()).optional()
  })
])

// 2. Place Schema (Supports local image paths)
const PlaceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  name_en: z.string().min(1),
  name_local: z.string().min(1),
  category: z.enum(['food', 'sight']),
  description: DescriptionSchema, 
  image: z.string().min(1), // ✅ Removed .url() to allow local paths
  is_generic_staple: z.boolean(),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
})

// 3. City Schema (The main structure)
const CitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(1),
  country_code: z.string().min(2).max(3),
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
  hero_image: z.string().min(1), // ✅ Removed .url()
  intro_vibe: z.string().min(1),
  general_info: z.object({
    population: z.string(),
    is_capital: z.boolean(),
    description: z.string()
  }),
  stats: z.object({
    currency: z.string(),
    plug_type: z.string()
  }),
  must_eat: z.array(PlaceSchema),
  must_see: z.array(z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    category: z.string().optional(),
    items: z.array(PlaceSchema)
  })),
  logistics: z.array(z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    icon: z.string(),
    summary: z.string().optional(),
    details: z.array(z.string())
  })),
  culture: z.object({
    etiquette_tips: z.array(z.string()).optional(),
    etiquette: z.array(z.string()).optional(),
    essential_phrases: z.array(z.any()).optional()
  }).optional(),
  neighborhoods: z.array(z.any()).optional()
}).passthrough() 

// --- EXECUTION ---
async function validateData() {
  console.log('🔍 Validating city data files...\n')
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  
  if (!fs.existsSync(citiesDir)) {
    console.error('❌ Cities directory not found at:', citiesDir)
    process.exit(1)
  }

  const files = fs.readdirSync(citiesDir).filter(f => f.endsWith('.json'))
  let errorTotal = 0

  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(citiesDir, file), 'utf-8')
      const data = JSON.parse(content)
      CitySchema.parse(data)
      console.log(`✅ ${file}`)
    } catch (e) {
      console.error(`❌ ${file}: Validation failed`)
      
      // ✅ BULLETPROOF ERROR PRINTER
      const issues = e.issues || (e.errors && Array.isArray(e.errors) ? e.errors : null);
      
      if (issues) {
        issues.forEach(err => {
          const pathStr = err.path ? err.path.join('.') : 'root'
          console.error(`   -> [${pathStr}]: ${err.message}`)
        })
      } else {
        console.error(`   -> ${e.message || 'Unknown error'}`)
      }
      errorTotal++
    }
  })

  console.log('\n' + '─'.repeat(50))
  if (errorTotal === 0) {
    console.log(`✨ SUCCESS: All ${files.length} city files are 100% valid!`)
    process.exit(0)
  } else {
    console.error(`❌ FAILURE: Found ${errorTotal} file(s) with errors.`)
    process.exit(1)
  }
}

validateData()