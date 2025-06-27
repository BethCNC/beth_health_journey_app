import axios from 'axios';
import fs from 'fs';
import path from 'path';

// --- Configuration ---
// TO DO: Fill these in after getting them from the provider
const GASTRO_CONFIG = {
  practiceId: 'YOUR_PRACTICE_ID',
  patientId: 'YOUR_PATIENT_ID',
  apiKey: 'YOUR_API_KEY', // Or whatever auth method they use
};

const API_BASE_URL = `https://mu3.gmed.com/api/${GASTRO_CONFIG.practiceId}/patient/${GASTRO_CONFIG.patientId}`;
const OUTPUT_DIR = path.join(process.cwd(), 'processed-data', 'gastroenterology');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// --- API Endpoints ---
const ENDPOINTS = {
  demographics: [
    'name',
    'gender',
    'dob',
    'race',
    'ethnicity',
    'language',
  ],
  clinical: [
    'smokingstatus',
    'problems',
    'medications',
    'allergies',
    'results',
    'vitalsigns',
    'procedures',
  ],
  fullCCDA: 'fullccda',
};

// --- Helper Functions ---
async function fetchData(endpoint: string) {
  const url = `${API_BASE_URL}/${endpoint}`;
  console.log(`Fetching data from: ${url}`);

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${GASTRO_CONFIG.apiKey}`, // Assuming Bearer token auth
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      console.log(`  ✅ Success: Fetched ${endpoint}`);
      return response.data;
    }
  } catch (error) {
    console.error(`  ❌ Error fetching ${endpoint}:`);
    if (axios.isAxiosError(error)) {
      console.error(`     Status: ${error.response?.status}`);
      console.error(`     Data: ${JSON.stringify(error.response?.data)}`);
    } else {
      console.error(error);
    }
  }
  return null;
}

function saveDate(data: any, filename: string) {
  if (!data) return;
  const filePath = path.join(OUTPUT_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  💾 Data saved to ${filePath}`);
}

// --- Main Execution ---
async function importGastroData() {
  console.log(' Gastroenterology Data Import ');
  
  if (GASTRO_CONFIG.practiceId === 'YOUR_PRACTICE_ID' || GASTRO_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.error('❌ Please update the GASTRO_CONFIG in this script with your credentials.');
    return;
  }

  console.log('\\nFetching demographic data...');
  for (const endpoint of ENDPOINTS.demographics) {
    const data = await fetchData(endpoint);
    saveDate(data, `demographics-${endpoint}`);
  }
  
  console.log('\\nFetching clinical data...');
  for (const endpoint of ENDPOINTS.clinical) {
    const data = await fetchData(endpoint);
    saveDate(data, `clinical-${endpoint}`);
  }
  
  console.log('\\nFetching full CCDA...');
  const fullCCDA = await fetchData(ENDPOINTS.fullCCDA);
  saveDate(fullCCDA, 'full-ccda-report');

  console.log('\\n✅ Gastroenterology data import complete.');
}

importGastroData(); 