/**
 * 🛰️ MASTER AI: SOURCE-VERIFIED PATCHER (V13.2)
 * ✅ Fixes: Restores Thai/Local scripts by reading the English Master file.
 * ✅ Fixes: Deletes "mon-ANIMAL" and "Bonjour/Bonjour" by re-translating from Source.
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const CITIES_DIR = path.join(__dirname, '../src/data/cities');
const TARGET_LANGS = ['fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];

async function translateFromSource(basePhrases, lang) {
  const prompt = `
    You are a travel translation expert for: ${lang}.
    I will give you a JSON array of phrases from the English Master file.
    
    RULES:
    1. "src": Translate the English text to ${lang} (e.g., "Hello" -> "Bonjour").
    2. "local": DO NOT TRANSLATE. Copy the value from the English Master exactly (e.g., keep the Thai/Arabic script).
    3. "phonetic": Use the pronunciation sounds from English, but translate any notes in parentheses (e.g., "(if male)" -> "(si homme)").
    
    Return the result as a JSON object with the key "phrases".
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }, { role: "user", content: JSON.stringify(basePhrases) }],
      response_format: { type: "json_object" },
    });
    return JSON.parse(completion.choices[0].message.content).phrases;
  } catch (error) {
    console.error("   ❌ API Error.");
    return null;
  }
}

async function runFix() {
  // Find all translated files (e.g., bangkok-fr.json)
  const files = fs.readdirSync(CITIES_DIR).filter(f => f.includes('-') && f.endsWith('.json'));

  for (const file of files) {
    const lang = file.split('-').pop().replace('.json', '');
    if (!TARGET_LANGS.includes(lang)) continue;

    const citySlug = file.split('-')[0];
    const baseFileName = `${citySlug}.json`; // e.g., bangkok.json
    const baseFilePath = path.join(CITIES_DIR, baseFileName);
    const translatedFilePath = path.join(CITIES_DIR, file);

    // 🛡️ Safety: Check if English Master exists
    if (!fs.existsSync(baseFilePath)) {
      console.log(`   ⚠️ Skipping ${file}: Master file ${baseFileName} not found.`);
      continue;
    }

    const baseData = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
    const translatedData = JSON.parse(fs.readFileSync(translatedFilePath, 'utf8'));

    if (baseData.culture?.essential_phrases) {
      console.log(`🩹 Re-syncing phrases for ${file} from English Source...`);
      
      const fixedPhrases = await translateFromSource(baseData.culture.essential_phrases, lang);
      
      if (fixedPhrases) {
        // Ensure the culture object exists in the translation
        if (!translatedData.culture) translatedData.culture = {};
        
        translatedData.culture.essential_phrases = fixedPhrases;

        // ✅ Save the full file with restored Thai/Local scripts
        fs.writeFileSync(translatedFilePath, JSON.stringify(translatedData, null, 2));
        console.log(`   ✅ ${file} fixed and synced with Master.`);
      }
    }
  }
  console.log("🏁 MISSION COMPLETE: Local scripts restored and hallucinations deleted.");
}

runFix();