import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'Sitios.xlsx');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

const sites = jsonData.map(row => ({
  id: row['ID'],
  name: row['Nombre']
}));

fs.writeFileSync('sites.json', JSON.stringify(sites, null, 2));
console.log('Done writing sites.json');
