import fs from 'fs';
import path from 'path';

// Load sites
const sites = JSON.parse(fs.readFileSync('sites.json', 'utf8'));
const outputDir = path.join('public', 'images', 'sites');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate a random pastel color
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
}

function generateSVG(name) {
  const color = getRandomColor();
  // Simple wrapping for text
  const words = name.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length < 15) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  const textElement = lines.map((line, i) => 
    `<text x="50%" y="${45 + (i * 10)}%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#333">${line}</text>`
  ).join('');

  return `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  ${textElement}
  <text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#666">Mineral del Monte</text>
</svg>`;
}

// Manual extra sites generation
const extraSites = [
    { id: 'manual_veracruz', name: 'Capilla de Veracruz' }
];

[...sites, ...extraSites].forEach(site => {
  // Generate 3 unique images for each site
  for (let i = 1; i <= 3; i++) {
    // Pass index to get a variance or just random
    const svgContent = generateSVG(`${site.name} ${i}`); // Add index to text
    const fileName = `site_${site.id}_${i}.svg`;
    fs.writeFileSync(path.join(outputDir, fileName), svgContent);
    console.log(`Generated ${fileName}`);
  }
});

console.log('All placeholder images generated.');
