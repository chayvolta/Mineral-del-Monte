import fs from 'fs';
import https from 'https';

const sites = JSON.parse(fs.readFileSync('sites_raw.json', 'utf8'));
const fixedSites = [];
const errors = [];

function resolveUrl(url) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(null);
    if (!url.startsWith('http')) return resolve(null);

    https.get(url, (res) => {
      // If it's a redirect, the useful info is in the location header
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        // Sometimes it might not redirect immediately if it's a consent page, but for goo.gl it usually does
        resolve(res.responseUrl || url); 
      }
    }).on('error', (e) => {
      resolve(null);
    });
  });
}

function extractCoords(url) {
  if (!url) return null;
  
  // Pattern 1: !3dlat!4dlng (Google Maps data pb parameters) - MOST ACCURATE
  const pbMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pbMatch) return [parseFloat(pbMatch[1]), parseFloat(pbMatch[2])];

  // Pattern 2: q=lat,lng (Search query pin) - ACCURATE
  const qMatch = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return [parseFloat(qMatch[1]), parseFloat(qMatch[2])];

  // Pattern 3: @lat,lng (Viewport center) - LEAST ACCURATE (Fallback)
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];

  return null;
}

async function processSites() {
  console.log('Resolving URLs...');
  
  for (const site of sites) {
    let lat = site.coord1;
    let lng = site.coord2;
    let method = 'excel';

    if (site.url) {
      try {
        const fullUrl = await resolveUrl(site.url);
        if (fullUrl) {
           const coords = extractCoords(fullUrl);
           if (coords) {
             lat = coords[0];
             lng = coords[1];
             method = 'url_resolved';
           }
        }
      } catch (e) {
        console.error(`Error resolving ${site.name}:`, e.message);
      }
    }

    // Fallback if URL resolution failed but Excel data exists
    // Handle the "undefined" logic
    const isValid = lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);

    fixedSites.push({
      ...site,
      finalLat: lat,
      finalLng: lng,
      method: method,
      isValid: isValid
    });
    
    console.log(`Processed ${site.id}: ${site.name} => [${lat}, ${lng}] (${method})`);
    
    // Tiny delay to be nice
    await new Promise(r => setTimeout(r, 200)); 
  }

  fs.writeFileSync('sites_fixed.json', JSON.stringify(fixedSites, null, 2));
  console.log('Saved sites_fixed.json');
}

processSites();
