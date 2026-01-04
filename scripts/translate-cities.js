const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

const TARGET_LANGS = ['fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
const CITIES_DIR = path.join(__dirname, '../src/data/cities');

// The exact slugs we are hunting for
const TARGET_CITY_SLUGS = ['hong-kong', 'rio-de-janeiro', 'los-angeles', 'new-york'];

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY not found in .env.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 90000 });

async function translateChunk(data, lang) {
  if (!data || Object.keys(data).length === 0) return data;
  
  const prompt = `
    You are translating content for a modern travel guide website. Target language: ${lang}

    RULES:
    1. Return ONLY the translation as a JSON object. No extra text or explanations.
    2. Tone: Friendly and informative, like a knowledgeable local friend.
    3. Formality: Use polite/neutral form consistently:
       - French: "vous"
       - Spanish: "usted" or neutral infinitives
       - Italian: "Lei"
       - German: "Sie"
       - Chinese: 您 (nín)
       - Arabic: أنتم (antum)
       - Hindi: आप (aap)
       - Japanese: です/ます form
    4. CRITICAL: Translate EVERYTHING. Never return the original English values for descriptions, vibe, history, or tips.
    5. Preserve: Place names, transport codes (BTS, MRT, U-Bahn, Tube), units (°C, km), and currency symbols (£, $, €, ฿).
    6. Maintain JSON structure exactly. Only translate string values.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }, { role: "user", content: JSON.stringify(data) }],
      response_format: { type: "json_object" },
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) { throw new Error(`Chunk failed: ${error.message}`); }
}

async function translateCity(citySlug, lang, baseData) {
  const targetPath = path.join(CITIES_DIR, `${citySlug}-${lang}.json`);
  if (fs.existsSync(targetPath)) return; // Skip if already exists

  console.log(`🌍 Processing ${citySlug.toUpperCase()} ➡️ ${lang.toUpperCase()}`);
  const translated = { ...baseData };

  try {
    const sections = ['intro_vibe', 'general_info', 'stats', 'city_vibe_summary', 'best_time_to_visit', 'weather_breakdown', 'must_see', 'must_eat', 'itinerary', 'affiliate_products', 'logistics', 'neighborhoods', 'culture'];
    for (const section of sections) {
      if (translated[section]) {
        if (Array.isArray(translated[section])) {
          for (let i = 0; i < translated[section].length; i++) {
            translated[section][i] = await translateChunk(translated[section][i], lang);
          }
        } else {
          translated[section] = await translateChunk(translated[section], lang);
        }
      }
    }
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2));
    console.log(`✅ SUCCESS: ${citySlug}-${lang}.json saved.`);
  } catch (error) {
    console.error(`❌ ABORTED: ${error.message}`);
  }
}

async function run() {
  const allFiles = fs.readdirSync(CITIES_DIR);
  console.log(`📂 Scanning: ${CITIES_DIR}`);

  const masterFiles = allFiles.filter(f => {
    // 1. Must be a JSON file and not a translation (no dash)
    if (!f.endsWith('.json') || f.includes('-')) return false;

    const slugFromFile = f.replace('.json', '').toLowerCase().trim();
    
    // 2. LOG EVERY MASTER FILE (Debugging)
    console.log(`🔍 Checking Master: "${slugFromFile}"`);

    // 3. CHECK FOR MATCH
    return TARGET_CITY_SLUGS.some(target => slugFromFile === target.toLowerCase().trim());
  });

  if (masterFiles.length === 0) {
    console.log("\n❌ STILL NO MATCH. Manually checking specific paths...");
    // Fallback: If the filter failed, try to force-load the specific paths you provided
    for (const slug of TARGET_CITY_SLUGS) {
        const manualPath = path.join(CITIES_DIR, `${slug}.json`);
        if (fs.existsSync(manualPath)) {
            console.log(`🎯 Found via Force-Path: ${slug}.json`);
            masterFiles.push(`${slug}.json`);
        }
    }
  }

  if (masterFiles.length === 0) {
    console.log("❌ CRITICAL: The files do not exist at the expected path.");
    return;
  }

  for (const file of masterFiles) {
    const baseData = JSON.parse(fs.readFileSync(path.join(CITIES_DIR, file), 'utf8'));
    for (const lang of TARGET_LANGS) {
      await translateCity(file.replace('.json', ''), lang, baseData);
    }
  }
}

run();