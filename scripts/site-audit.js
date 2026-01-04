const fs = require('fs');
const path = require('path');

const CITIES_DIR = path.join(__dirname, '../src/data/cities');
const LANGUAGES = ['fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar']; // English is the base

function runAudit() {
  console.log("🔍 Starting Master AI Site Audit...\n");

  const files = fs.readdirSync(CITIES_DIR);
  const cityGroups = {};

  // 1. Group files by city slug
  files.forEach(file => {
    if (!file.endsWith('.json')) return;
    const fileNameNoExt = file.replace('.json', '');
    const parts = fileNameNoExt.split('-');
    
    let baseSlug = fileNameNoExt;
    let isTranslation = false;
    
    if (parts.length > 1 && LANGUAGES.includes(parts[parts.length - 1])) {
      baseSlug = parts.slice(0, -1).join('-');
      isTranslation = true;
    }

    if (!cityGroups[baseSlug]) {
      cityGroups[baseSlug] = {
        baseFile: null,
        translations: [],
        errors: [],
        warnings: []
      };
    }

    if (!isTranslation) {
      cityGroups[baseSlug].baseFile = file;
    } else {
      cityGroups[baseSlug].translations.push(parts[parts.length - 1]);
    }
  });

  // 2. Audit each group
  Object.keys(cityGroups).forEach(slug => {
    const group = cityGroups[slug];
    console.log(`🏙️  Auditing: [${slug.toUpperCase()}]`);

    if (!group.baseFile) {
      group.errors.push("❌ CRITICAL: Missing base English file!");
    } else {
      const data = JSON.parse(fs.readFileSync(path.join(CITIES_DIR, group.baseFile), 'utf8'));
      
      // Check Map Data
      if (!data.lat || !data.lng) group.errors.push("📍 Missing Coordinates (Map will be broken)");
      if (!data.region || data.region === "Other") group.warnings.push("🏳️  No Region assigned (Pin will be Gray)");
      
      // Check Content
      if (!data.logistics || data.logistics.length === 0) group.warnings.push("📦 Logistics section is empty");
      if (!data.itinerary || data.itinerary.length === 0) group.warnings.push("⏳ Itinerary section is empty");
    }

    // Check Translations
    const missingLangs = LANGUAGES.filter(l => !group.translations.includes(l));
    if (missingLangs.length > 0) {
      group.warnings.push(`🌎 Missing Translations: [${missingLangs.join(', ')}]`);
    }

    // Output Results
    if (group.errors.length === 0 && group.warnings.length === 0) {
      console.log("   ✅ Perfect Health");
    } else {
      group.errors.forEach(err => console.log(`   ${err}`));
      group.warnings.forEach(warn => console.log(`   ${warn}`));
    }
    console.log("");
  });

  console.log("---------------------------------------");
  console.log("✅ Audit Complete.");
}

runAudit();