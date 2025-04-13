import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ATRIUM_TOKEN_FILE_PATH = path.join(process.cwd(), 'data/atrium-fhir-token.json');

// Create an interface for reading from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompts the user for input
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Parses the MyChart session token from localStorage and extracts needed information
 */
async function extractMyChartToken() {
  console.log('===== MyChart Token Extractor =====');
  console.log('This script helps extract tokens from your MyChart browser session.\n');
  
  console.log('INSTRUCTIONS:');
  console.log('1. Log in to your MyChart account in your browser');
  console.log('2. Open browser developer tools (F12 or right-click > Inspect)');
  console.log('3. Go to Application tab > Storage > Local Storage');
  console.log('4. Find "MYCHART-WEB-DEVICE-/myatriumhealth/"');
  console.log('5. Copy the entire value (starts with "WEB,...")\n');
  
  const rawToken = await prompt('Paste the MyChart localStorage value: ');
  
  if (!rawToken || !rawToken.startsWith('WEB,')) {
    console.error('Invalid token format. The token should start with "WEB,"');
    process.exit(1);
  }
  
  // Attempt to extract patient ID from the MyChart session
  console.log('\nTrying to find patient ID...');
  const patientId = await prompt('Enter your MyChart patient ID (if known): ');
  
  // Create token data structure
  const tokenData = {
    access_token: rawToken,
    token_type: 'MyChartSession',
    patient: patientId || null,
    mychart_session: true,
    extracted_at: new Date().toISOString()
  };
  
  // Ensure data directory exists
  const dataDir = path.dirname(ATRIUM_TOKEN_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Save the token
  fs.writeFileSync(ATRIUM_TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2), 'utf-8');
  console.log(`\nToken saved to ${ATRIUM_TOKEN_FILE_PATH}`);
  
  // Set environment variable
  process.env.HEALTH_SYSTEM = 'atrium';
  
  // Ask if they want to run the import
  const runImport = await prompt('\nDo you want to run the import script now? (y/n): ');
  
  if (runImport.toLowerCase() === 'y') {
    const useMock = await prompt('Use mock data instead of real API? (y/n, default: n): ');
    const mockFlag = useMock.toLowerCase() === 'y' ? '--mock' : '';
    
    console.log('\nRunning import script...');
    const { execSync } = require('child_process');
    
    try {
      execSync(`npx ts-node scripts/import-from-mychart.ts ${mockFlag}`, { stdio: 'inherit' });
      console.log('Import completed.');
    } catch (error) {
      console.error('Error running import script:', error);
    }
  }
  
  rl.close();
}

// Run the script
extractMyChartToken().catch((error) => {
  console.error('Error extracting token:', error);
  rl.close();
  process.exit(1);
}); 