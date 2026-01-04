const fs = require('fs');
const path = require('path');

const CITIES_DIR = path.join(__dirname, '../src/data/cities');

// Ensure this list matches your filenames exactly (without .json)
const DATA_DB = {
  "bangkok": { lat: 13.7563, lng: 100.5018, region: "Asia" },
  "tokyo": { lat: 35.6895, lng: 139.6917, region: "Asia" },
  "paris": { lat: 48.8566, lng: 2.3522, region: "Europe" },
  "berlin": { lat: 52.5200, lng: 13.4050, region: "Europe" },
  "london": { lat: 51.5074, lng: -0.1278, region: "Europe" },
  "new-york": { lat: 40.7128, lng: -74.0060, region: "North America" },
  "los-angeles": { lat: 34.0522, lng: -118.2437, region: "North America" },
  "istanbul": { lat: 41.0082, lng: 28.9784, region: "Middle East" },
  "rome": { lat: 41.9028, lng: 12.4964, region: "Europe" },
  "hong-kong": { lat: 22.3193, lng: 114.1694, region: "Asia" },
  "rio-de-janeiro": { lat: -22.9068, lng: -43.1729, region: "South America" }
};

function injectData() {
  const files = fs.readdirSync(CITIES_DIR);
  
  files.forEach(file => {
    if (!file.endsWith('.json')) return;
    
    // Improved slug detection: handles 'cityname.json' and 'cityname-lang.json'
    const fileNameNoExt = file.replace('.json', '');
    const parts = fileNameNoExt.split('-');
    
    // Check if it's a translated file (e.g., hong-kong-fr) or base (hong-kong)
    let slugCandidate = fileNameNoExt;
    if (parts.length > 1 && ['fr','es','it','ja','hi','de','zh','ar'].includes(parts[parts.length-1])) {
        slugCandidate = parts.slice(0, -1).join('-');
    }

    const cityData = DATA_DB[slugCandidate];

    if (cityData) {
      const filePath = path.join(CITIES_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      data.lat = cityData.lat;
      data.lng = cityData.lng;
      data.region = cityData.region; 

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ SUCCESS: ${file} updated with Region: ${cityData.region}`);
    } else {
      console.warn(`❌ SKIPPED: ${file} (No data in DB for slug: ${slugCandidate})`);
    }
  });
}

injectData();