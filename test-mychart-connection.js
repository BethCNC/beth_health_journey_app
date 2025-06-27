const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function testMyChartConnection() {
  console.log('🔍 MyChart API Connection Test\n');
  
  // Check Novant
  const novantTokenPath = path.join(process.cwd(), 'data', 'fhir-token.json');
  const novantConnected = fs.existsSync(novantTokenPath);
  if(novantConnected) {
      console.log('✅ Found Novant Health token');
  } else {
      console.log('🟡 Novant Health token not found.');
  }

  // Check CEENTA
  const ceentaTokenPath = path.join(process.cwd(), 'data', 'ceenta-fhir-token.json');
  const ceentaConnected = fs.existsSync(ceentaTokenPath);
  if(ceentaConnected) {
      console.log('✅ Found CEENTA token');
  } else {
      console.log('🟡 CEENTA token not found.');
  }
  
  console.log('\n🧪 Testing API Connections...\n');
  
  // Test Atrium
  console.log('\nTesting Atrium Health MyChart...');
  const atriumResult = await handleAtriumConnection();
  
  // Test Novant
  if (novantConnected) {
    console.log('\nTesting Novant Health MyChart...');
    const token = JSON.parse(fs.readFileSync(novantTokenPath, 'utf-8'));
    await testNovantConnection(token);
  }

  console.log('\n📊 Summary of Connections:');
  console.log(`- Atrium Health: ${atriumResult ? '✅ Connected' : '❌ Not Connected'}`);
  console.log(`- Novant Health: ${novantConnected ? '✅ Token Available' : '❌ No Token'}`);
  console.log(`- CEENTA: ${ceentaConnected ? '✅ Token Available' : '❌ No Token'}`);

  rl.close();
}

async function handleAtriumConnection() {
  const atriumTokenPath = path.join(process.cwd(), 'data', 'atrium-fhir-token.json');
  if (fs.existsSync(atriumTokenPath)) {
    console.log('✅ Found Atrium Health token');
    const token = JSON.parse(fs.readFileSync(atriumTokenPath, 'utf-8'));
    return await testAtriumConnection(token);
  } else {
    console.log('\n🟡 Atrium Health token not found.');
    console.log('Please follow these steps:');
    console.log('1. Log in to your Atrium Health MyChart account.');
    console.log('2. Navigate to the "Request Computer-Readable Export" page.');
    console.log('   (Often found under "Sharing" > "Share My Record" or similar)');
    console.log('3. Follow the authorization steps until you receive a JSON object.');

    const tokenJson = await prompt('\nPlease paste the entire JSON object for your Atrium token here: ');
    try {
      const token = JSON.parse(tokenJson);
      fs.writeFileSync(atriumTokenPath, JSON.stringify(token, null, 2), 'utf-8');
      console.log(`Token saved to ${atriumTokenPath}`);
      return await testAtriumConnection(token);
    } catch (e) {
      console.error('❌ Invalid JSON pasted. Please try again.');
      return false;
    }
  }
}

async function testAtriumConnection(token) {
  if (!token.state) {
    console.log('  ❌ ERROR: Atrium token is missing the `state` field containing the API URL.');
    return false;
  }
  const url = token.state.split(',')[1]; // The API URL is the second part of the state
  try {
    console.log(`  Testing ${url}...`);
    
    const headers = {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    };

    const response = await axios.get(`${url}/Patient/${token.patient}`, {
      headers,
      timeout: 10000
    });
    
    console.log(`  ✅ SUCCESS: ${url}`);
    console.log(`     Status: ${response.status}`);
    return true;
    
  } catch (error) {
    console.log(`  ❌ Failed: ${url}`);
    if (error.response) {
      console.log(`     Status: ${error.response.status}`);
      console.log(`     Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testNovantConnection(token) {
  const url = 'https://epicproxy.et0798.epichosted.com/APIProxyPRD/api/FHIR/R4';
  try {
    console.log(`  Testing ${url}...`);
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `${token.token_type} ${token.access_token}`
    };
    
    if (token.patient) {
      headers['X-Epic-Patient-Id'] = token.patient;
    }
    
    const response = await axios.get(`${url}/Patient`, {
      headers,
      timeout: 5000
    });
    
    console.log(`  ✅ SUCCESS: ${url}`);
    console.log(`     Status: ${response.status}`);
    return true;
    
  } catch (error) {
    console.log(`  ❌ Failed: ${url}`);
    if (error.response) {
      console.log(`     Status: ${error.response.status}`);
      console.log(`     Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Run the test
testMyChartConnection().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
}); 