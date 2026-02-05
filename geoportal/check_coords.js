import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'Sitios.xlsx');
try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const allSites = jsonData.map(row => ({
        id: row['ID'],
        name: row['Nombre'],
        coord1: row['Coord 1'],
        coord2: row['Coord 2'],
        url: row['Ubicación']
    }));
    fs.writeFileSync('sites_raw.json', JSON.stringify(allSites, null, 2));
    console.log(`Saved ${allSites.length} sites to sites_raw.json`);
} catch (error) {
    console.error("Error reading file:", error);
}
