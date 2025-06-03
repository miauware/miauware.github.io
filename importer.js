import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lang = 'pt';
const downloadFolder = path.join(__dirname, './files');

async function fetchZenithSublimation() {
  try {
    const { data: zenithSublimation } = await axios.get('https://api.zenithwakfu.com/builder/api/shards', {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": `lang=${lang}`
      }
    });

    saveFile(zenithSublimation, path.join(downloadFolder, `zenithSublimation_${lang}.json`));
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
  }
}

function saveFile(data, filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Arquivo salvo em: ${filePath}`);
}

fetchZenithSublimation();
