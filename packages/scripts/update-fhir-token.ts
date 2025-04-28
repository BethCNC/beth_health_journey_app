import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const TOKENS_DIR = path.join(process.cwd(), 'data');
const EPIC_TOKEN_FILE_PATH = path.join(TOKENS_DIR, 'fhir-token.json');
const ATRIUM_TOKEN_FILE_PATH = path.join(TOKENS_DIR, 'atrium-fhir-token.json');
const IMPORT_SCRIPT_PATH = path.join(process.cwd(), 'scripts/import-from-mychart.ts');

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
 * Updates the FHIR token file
 */
async function updateToken() {
  console.log('===== Health System FHIR Token Update =====');
  console.log('This script will update your FHIR access token and run the import.\n');
  
  // Select health system
  const healthSystem = await prompt('Select health system (novant/atrium): ');
  
  if (!['novant', 'atrium'].includes(healthSystem.toLowerCase())) {
    console.error('Invalid health system. Please select either "novant" or "atrium".');
    process.exit(1);
  }
  
  // Set environment variable for the import script
  process.env.HEALTH_SYSTEM = healthSystem.toLowerCase();
  
  let tokenData: any = {};
  let tokenFilePath = '';
  
  if (healthSystem.toLowerCase() === 'novant') {
    tokenFilePath = EPIC_TOKEN_FILE_PATH;
    console.log('\nPlease provide your Epic (Novant) token details:');
    const accessToken = await prompt('Enter your access token: ');
    const tokenType = await prompt('Enter token type (default: Bearer): ') || 'Bearer';
    const patient = await prompt('Enter patient ID (if known): ');
    const expiration = await prompt('Enter expiration date/time (YYYY-MM-DDTHH:MM:SS, optional): ');
    
    tokenData = {
      access_token: accessToken,
      token_type: tokenType,
      expires_at: expiration || null,
      scope: 'patient/*.read',
      patient: patient || null
    };
  } else {
    // Atrium Health - handle localStorage format
    tokenFilePath = ATRIUM_TOKEN_FILE_PATH;
    console.log('\nPlease provide your Atrium Health MyChart Web Session token:');
    console.log('(You can find this in your browser\'s developer tools -> Application -> Local Storage -> "MYCHART-WEB-DEVICE-/myatriumhealth/")');
    
    const webSessionToken = await prompt('Enter the full MyChart web session value: ');
    const patientId = await prompt('Enter your MyChart patient ID (if known): ');
    
    tokenData = {
      access_token: webSessionToken,
      token_type: 'MyChartSession', // Custom type for MyChart
      expires_at: null, // MyChart session tokens typically don't provide expiration in the token itself
      patient: patientId || null,
      mychart_session: true // Flag to indicate this is a MyChart session token
    };
  }
  
  try {
    // Ensure directory exists
    if (!fs.existsSync(TOKENS_DIR)) {
      fs.mkdirSync(TOKENS_DIR, { recursive: true });
    }
    
    // Write token to file
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
    console.log(`\nToken successfully saved to ${tokenFilePath}`);
    
    // Ask if user wants to run the import script
    const runImport = await prompt('\nDo you want to run the import script now? (y/n): ');
    
    if (runImport.toLowerCase() === 'y') {
      console.log('\nRunning import script...');
      // Set USE_MOCK_DATA based on user preference
      const useMockData = await prompt('Use mock data instead of real API? (y/n, default: n): ');
      const mockDataFlag = useMockData.toLowerCase() === 'y' ? '--mock' : '';
      
      try {
        // Run the import script
        execSync(`npx ts-node ${IMPORT_SCRIPT_PATH} ${mockDataFlag}`, { stdio: 'inherit' });
        console.log('Import completed.');
      } catch (error) {
        console.error('Error running import script:', error);
      }
    }
  } catch (error) {
    console.error('Error saving token:', error);
  } finally {
    rl.close();
  }
}

// Run the script
updateToken().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 