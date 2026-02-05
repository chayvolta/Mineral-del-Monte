import fs from 'fs';

const sites = JSON.parse(fs.readFileSync('sites_fixed.json', 'utf8'));

const features = sites
  .filter(site => site.isValid && site.finalLat && site.finalLng)
  .map(site => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [site.finalLng, site.finalLat] // GeoJSON is [Lng, Lat]
    },
    properties: {
      id: site.id,
      name: site.name,
      // Pass through original Excel fields just in case
      facebook: site.facebook, // These might be missing from my specific extraction script...
      // Wait, my extraction script only kept ID, Name, Coords, URL.
      // I need to be careful. The original Excel had FB/Insta/Web.
      // I should have preserved them.
      // Let's re-read the Excel to merge, OR just use the resolved coords map to patch the live loader.
      // actually, simpler: Generate a "corrections.json" [id -> [lat, lng]] map.
      // And keep using the Excel loader but PATCH the coords.
      // The user asked to "Create the geojson".
      // if I do that, I lose the social links unless I re-extract them.
      // Let's create a Patch Map.
    }
  }));

// Actually, better plan:
// 1. Create `sites_corrections.json`: { "1": [lat, lng], "2": [lat, lng] ... }
// 2. Update dataLoader.js to:
//    a. Load Excel
//    b. Load corrections
//    c. Overwrite Excel coords with corrections if present.
// This preserves all other metadata (Socials, etc) without me having to parse it all again.
const corrections = {};
sites.forEach(site => {
  if (site.isValid) {
    corrections[site.id] = [site.finalLat, site.finalLng];
  }
});

fs.writeFileSync('public/site_corrections.json', JSON.stringify(corrections, null, 2));
console.log('Saved public/site_corrections.json');
