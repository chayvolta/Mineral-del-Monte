import * as XLSX from 'xlsx';

export const loadSites = async () => {
  try {
    const [excelResponse, correctionsResponse] = await Promise.all([
      fetch('/Sitios.xlsx'),
      fetch('/site_corrections.json')
    ]);

    const arrayBuffer = await excelResponse.arrayBuffer();
    const corrections = await correctionsResponse.json();

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Transform and filter Excel data
    const sites = jsonData.map(row => {
      const id = row['ID'] || Math.random().toString(36).substr(2, 9);
      
      // Default from Excel
      let lat = row['Coord 1'];
      let lng = row['Coord 2'];

      // Apply correction if available
      if (corrections[id]) {
        lat = corrections[id][0];
        lng = corrections[id][1];
      }

      // Basic validation for coordinates
      const isValidCoords = 
        typeof lat === 'number' && 
        typeof lng === 'number' && 
        !isNaN(lat) && 
        !isNaN(lng);

      return {
        id: id,
        name: row['Nombre'],
        facebook: row['Facebook'],
        instagram: row['Instagram'],
        web: row['Web'],
        locationUrl: row['Ubicación'],
        position: isValidCoords ? [lat, lng] : null,
        hasCoords: isValidCoords,
        // Generate array of 3 unique images
        images: [
          `/images/sites/site_${id}_1.svg`,
          `/images/sites/site_${id}_2.svg`,
          `/images/sites/site_${id}_3.svg`
        ]
      };
    });

    return sites;
  } catch (error) {
    console.error("Error loading sites data:", error);
    return [];
  }
};
