/**
 * 🛰️ MASTER AI: THE SAFE SURGERY PATCHER
 * ✅ Strategy: Only fix strings that are identical to the English source.
 * ✅ Safety: Strictly ignores IDs, Slugs, and Local Names.
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TARGET_LANGS = ['fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
const CITIES_DIR = path.join(__dirname, '../src/data/cities');

// 🛡️ PROTECTION LIST: The script will NEVER touch these keys
const PROTECTED_KEYS = [
  'id', 
  'slug', 
  'name_local', 
  'name_en', 
  'image', 
  'hero_image', 
  'lat', 
  'lng', 
  'country_code', 
  'plug_type',
  'currency'
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateSinglePhrase(text, lang) {
  const prompt = `Translate this travel guide text into ${lang}. 
  Return ONLY the translated text. Use polite formality (vous/Sie/nǐn/aap).
  Text: "${text}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    return text;
  }
}

async function patchObject(translatedObj, baseObj, lang) {
  for (const key in baseObj) {
    // 🛑 Rule 1: Ignore if the key is protected
    if (PROTECTED_KEYS.includes(key)) continue;

    if (typeof baseObj[key] === 'object' && baseObj[key] !== null) {
      if (translatedObj[key]) {
        await patchObject(translatedObj[key], baseObj[key], lang);
      }
    } else if (typeof baseObj[key] === 'string') {
      // ✅ Rule 2: Only patch if the translated version is EXACTLY the same as English
      // and longer than 3 characters (to avoid messing up small codes/units).
      if (translatedObj[key] === baseObj[key] && baseObj[key].length > 3) {
        console.log(`   🩹 Patching Hole in [${key}]: "${baseObj[key].slice(0, 40)}..."`);
        translatedObj[key] = await translateSinglePhrase(baseObj[key], lang);
      }
    }
  }
}

async function runPatch() {
  const files = fs.readdirSync(CITIES_DIR).filter(f => !f.includes('-') && f.endsWith('.json'));

  for (const file of files) {
    const citySlug = file.replace('.json', '');
    const baseData = JSON.parse(fs.readFileSync(path.join(CITIES_DIR, file), 'utf8'));

    for (const lang of TARGET_LANGS) {
      const targetPath = path.join(CITIES_DIR, `${citySlug}-${lang}.json`);
      
      if (fs.existsSync(targetPath)) {
        const translatedData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        console.log(`🔍 Auditing ${citySlug}-${lang} for English leftovers...`);
        
        await patchObject(translatedData, baseData, lang);
        
        fs.writeFileSync(targetPath, JSON.stringify(translatedData, null, 2));
      }
    }
  }
  console.log("🏁 PATCHING COMPLETE: All identified holes have been filled.");
}

runPatch();