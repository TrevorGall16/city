/**
 * 🛰️ MASTER AI: IMAGE DATA AUDITOR (V1.0)
 * ✅ Purpose: Identifies missing 'image' keys in translated city JSON files.
 * ✅ Coverage: Scans Must See, Must Eat, and Neighborhoods.
 * ✅ Output: Categorized CLI report for easy manual fixing.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_DIR = path.join(__dirname, '../src/data/cities');

// Configuration: Which sections to check
const SECTIONS_TO_AUDIT = ['must_see', 'must_eat', 'neighborhoods'];

async function auditImages() {
  console.log('🚀 Starting CityBasic Image Audit...\n');

  try {
    const files = fs.readdirSync(CITIES_DIR);
    
    // Filter for translated files (e.g., paris-hi.json, tokyo-ja.json)
    const translationFiles = files.filter(file => /-\w{2}\.json$/.test(file));
    
    let totalIssues = 0;

    translationFiles.forEach(file => {
      const filePath = path.join(CITIES_DIR, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const [cityName, lang] = file.replace('.json', '').split('-');
      
      let fileIssues = [];

      // 1. Audit Must See (Nested: Category > Items)
      if (content.must_see && Array.isArray(content.must_see)) {
        content.must_see.forEach(category => {
          category.items?.forEach(item => {
            if (!item.image || item.image.trim() === "") {
              fileIssues.push(`[Must See] ${item.name_en || item.slug}`);
            }
          });
        });
      }

      // 2. Audit Must Eat (Flat Array)
      if (content.must_eat && Array.isArray(content.must_eat)) {
        content.must_eat.forEach(item => {
          if (!item.image || item.image.trim() === "") {
            fileIssues.push(`[Must Eat] ${item.name_en || item.slug}`);
          }
        });
      }

      // 3. Audit Neighborhoods (Flat Array)
      if (content.neighborhoods && Array.isArray(content.neighborhoods)) {
        content.neighborhoods.forEach(hood => {
          if (!hood.image || hood.image.trim() === "") {
            fileIssues.push(`[Neighborhood] ${hood.name}`);
          }
        });
      }

      // Report findings for this file
      if (fileIssues.length > 0) {
        console.log(`📍 FILE: ${file.toUpperCase()} (${lang})`);
        fileIssues.forEach(issue => console.log(`   ❌ Missing Image: ${issue}`));
        console.log('---');
        totalIssues += fileIssues.length;
      }
    });

    if (totalIssues === 0) {
      console.log('✅ CLEAN SWEEP: All translated images are present!');
    } else {
      console.log(`\n⚠️ TOTAL ISSUES FOUND: ${totalIssues}`);
      console.log('Run the "Image Auto-Fixer" next to sync from English base files.');
    }

  } catch (error) {
    console.error('🛑 Audit Failed:', error.message);
  }
}

auditImages();