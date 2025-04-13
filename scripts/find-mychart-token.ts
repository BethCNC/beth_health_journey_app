import fs from 'fs';
import path from 'path';
import readline from 'readline';
import axios from 'axios';

const TOKENS_DIR = path.join(process.cwd(), 'data');
const MYCHART_GUIDE_PATH = path.join(TOKENS_DIR, 'mychart-guide.md');

// Create directory if it doesn't exist
if (!fs.existsSync(TOKENS_DIR)) {
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
}

// Create an interface for reading from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define token data interface
interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  patient: string;
  state?: string;
  is_mock?: boolean;
  [key: string]: any; // Allow for additional properties
}

// Prompts the user for input
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Check if a URL is valid
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Extract tokens from browser cookies or localStorage
async function extractTokensFromBrowser() {
  console.log('===== MyChart Token Extractor =====');
  console.log('This utility will help you locate FHIR tokens in your MyChart account\n');
  
  // Create the guide file
  fs.writeFileSync(
    MYCHART_GUIDE_PATH,
    `# How to Find Your MyChart FHIR Token

## Option 1: Using Browser Developer Tools

1. Log into your MyChart account at Atrium or Novant
2. Open Developer Tools (F12 or Right-click -> Inspect)
3. Go to the "Application" tab
4. Look in the following locations:
   - Local Storage
   - Session Storage
   - Cookies
5. Search for items containing: "token", "fhir", "epic", "atrium", "access"

## Option 2: Using Third-Party App Connections

1. Log into your MyChart account
2. Go to Account Settings
3. Look for "Linked Apps & Devices" or "Third-Party Apps"
4. You may find options to generate API access tokens here

## Option 3: Checking Network Requests

1. Open Developer Tools (F12) and go to the "Network" tab
2. Browse your health records in MyChart
3. Look for requests to URLs containing "fhir" or "epic"
4. Examine the request headers for Authorization tokens

## Option 4: Using Apple Health App

1. Download the Apple Health app if you have an iPhone
2. Connect your MyChart account to Apple Health
3. This may generate the necessary tokens behind the scenes
`,
    'utf-8'
  );
  
  console.log(`Generated a guide to finding your MyChart token at: ${MYCHART_GUIDE_PATH}`);
  console.log('Please refer to this file for detailed instructions.\n');
  
  const healthSystem = await prompt('Which health system are you working with? (1 = Novant/Epic, 2 = Atrium): ');
  
  let tokenFilePath = path.join(TOKENS_DIR, 'fhir-token.json');
  let baseUrl = 'https://epicproxy.et0798.epichosted.com/APIProxyPRD/api/FHIR/R4';
  
  if (healthSystem === '2') {
    tokenFilePath = path.join(TOKENS_DIR, 'atrium-fhir-token.json');
    baseUrl = 'https://fhir.atrium.org/api/FHIR/R4'; // Placeholder - update when known
    console.log('\nAtrium Health MyChart is selected.\n');
  } else {
    console.log('\nNovant Health MyChart is selected.\n');
  }
  
  console.log('Please follow these steps:');
  console.log('1. Log into your MyChart account');
  console.log('2. Open Developer Tools (F12 or right-click -> Inspect)');
  console.log('3. Go to Application tab and look in LocalStorage, SessionStorage, and Cookies');
  console.log('4. Check for any entries containing "token", "fhir", or "access_token"\n');
  
  const foundToken = await prompt('Did you find a token? (y/n): ');
  
  if (foundToken.toLowerCase() === 'y') {
    const accessToken = await prompt('Please enter the access_token value: ');
    
    if (!accessToken.trim()) {
      console.log('No token provided. Exiting...');
      rl.close();
      return;
    }
    
    // Ask for token type and other metadata
    const tokenType = await prompt('Token type (default: Bearer): ');
    const patientId = await prompt('Patient ID (if available): ');
    const expiry = await prompt('Expiration time in seconds (default: 3600): ');
    
    // Create token JSON
    const tokenData: TokenData = {
      access_token: accessToken.trim(),
      token_type: tokenType.trim() || 'Bearer',
      expires_in: parseInt(expiry || '3600'),
      patient: patientId.trim(),
    };
    
    // Ask for API base URL
    const apiUrl = await prompt(`API base URL (default: ${baseUrl}): `);
    if (apiUrl.trim() && isValidUrl(apiUrl.trim())) {
      // If state parameter is supported, store the URL there
      tokenData.state = apiUrl.trim();
    }
    
    // Save token to file
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2), 'utf-8');
    console.log(`\nToken saved to ${tokenFilePath}`);
    
    // Verify token if possible
    const testToken = await prompt('\nWould you like to test if this token works? (y/n): ');
    
    if (testToken.toLowerCase() === 'y') {
      try {
        // Use the provided URL or default
        const testUrl = apiUrl.trim() || baseUrl;
        console.log(`Testing connection to ${testUrl}/Patient...`);
        
        const response = await axios.get(`${testUrl}/Patient`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `${tokenData.token_type} ${tokenData.access_token}`
          },
          timeout: 10000 // 10 second timeout
        });
        
        console.log('\nSuccess! The token appears to be valid.');
        console.log(`Response status: ${response.status}`);
      } catch (error) {
        console.error('\nError testing token:');
        if (axios.isAxiosError(error)) {
          console.error(`Status: ${error.response?.status || 'Unknown'}`);
          console.error(`Message: ${error.message}`);
        } else {
          console.error(error);
        }
        console.log('\nThe token may still be valid but couldn\'t be verified automatically.');
      }
    }
    
    console.log('\nTo use this token for importing data, run:');
    console.log(`npx ts-node scripts/import-from-mychart.ts`);
    
  } else {
    console.log('\nHere are some additional places to check for tokens:');
    console.log('1. MyChart -> Account Settings -> Connected Apps & Devices');
    console.log('2. MyChart -> Share My Record -> Connect to Research (if available)');
    console.log('3. Check if your healthcare provider offers a developer portal');
    console.log('4. Some health systems require requesting FHIR access through customer service');
    
    const tryAgain = await prompt('\nWould you like to try with mock data for now? (y/n): ');
    
    if (tryAgain.toLowerCase() === 'y') {
      // Create a mock token for testing
      const mockTokenData: TokenData = {
        access_token: 'mock_token_for_testing_purposes_only',
        token_type: 'Bearer',
        expires_in: 3600,
        patient: 'mock_patient_id',
        is_mock: true
      };
      
      fs.writeFileSync(tokenFilePath, JSON.stringify(mockTokenData, null, 2), 'utf-8');
      console.log(`\nMock token saved to ${tokenFilePath}`);
      console.log('You can now run the import with mock data:');
      console.log(`npx ts-node scripts/import-from-mychart.ts`);
    } else {
      console.log('\nExiting without creating a token. You can try again later when you have access to a token.');
    }
  }
  
  rl.close();
}

// Run the main function
extractTokensFromBrowser().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
}); 