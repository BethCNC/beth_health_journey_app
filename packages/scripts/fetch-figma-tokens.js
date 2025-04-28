/**
 * Fetch Figma design tokens script
 * 
 * This script connects to Figma API and fetches design tokens
 * from a specified Figma file, then processes and saves them
 * for use in the design system.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Figma API details
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_KEY || '';

// Error if no token
if (!FIGMA_API_TOKEN) {
  console.error('❌ No Figma API token found. Please add FIGMA_API_TOKEN to your .env file');
  process.exit(1);
}

// Error if no file ID
if (!FIGMA_FILE_ID) {
  console.error('❌ No Figma file ID found. Please add FIGMA_FILE_KEY to your .env file');
  process.exit(1);
}

// Ensure tokens directory exists
const TOKENS_DIR = path.join(__dirname, '..', 'tokens');
if (!fs.existsSync(TOKENS_DIR)) {
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
}

/**
 * Fetch design tokens from Figma file
 */
async function fetchFigmaTokens() {
  try {
    console.log('🔄 Fetching design tokens from Figma...');
    
    // Get Figma file data
    const figmaResponse = await axios.get(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}`, {
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN
      }
    });
    
    // Extract styles from the response
    const styles = figmaResponse.data.styles || {};
    const document = figmaResponse.data.document || {};
    
    // Extract color styles
    const colorTokens = {};
    Object.keys(styles).forEach(styleId => {
      const style = styles[styleId];
      if (style.style_type === 'FILL') {
        colorTokens[style.name] = {
          id: styleId,
          name: style.name,
          description: style.description || '',
          // We'll need to use another API call to get the actual color values
          type: 'color'
        };
      }
    });
    
    // Process all tokens into a JSON structure
    const tokens = {
      colors: colorTokens,
      // Other token types would be processed here
      // typography: typographyTokens,
      // spacing: spacingTokens,
      // etc.
    };
    
    // Save tokens to JSON file
    const tokensPath = path.join(TOKENS_DIR, 'tokens.json');
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
    
    console.log(`✅ Design tokens saved to ${tokensPath}`);
    
    return tokens;
  } catch (error) {
    console.error('❌ Error fetching Figma tokens:', error.message);
    if (error.response) {
      console.error('Response details:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the token fetcher
fetchFigmaTokens(); 