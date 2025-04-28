const fs = require('fs');
const path = require('path');

// Path to your tokens.json file
const TOKENS_PATH = path.join(__dirname, '../styles/tokens.json');
const CSS_VARS_PATH = path.join(__dirname, '../styles/tokens-variables.css');

// Convert tokens to CSS variables
function convertTokensToCssVariables() {
  try {
    const tokensData = fs.readFileSync(TOKENS_PATH, 'utf8');
    const tokens = JSON.parse(tokensData);
    
    let cssVariables = ':root {\n';
    
    // Process tokens recursively
    function processTokens(obj, prefix = '') {
      for (const key in obj) {
        const value = obj[key];
        
        if (value && value.$value !== undefined) {
          // This is a token with a value
          const varName = `--${prefix}${key.toLowerCase()}`;
          cssVariables += `  ${varName}: ${value.$value};\n`;
        } else if (typeof value === 'object') {
          // This is a nested object, recurse
          const newPrefix = prefix ? `${prefix}-${key.toLowerCase()}` : key.toLowerCase();
          processTokens(value, newPrefix);
        }
      }
    }
    
    processTokens(tokens);
    cssVariables += '}\n';
    
    // Write CSS variables to file
    fs.writeFileSync(CSS_VARS_PATH, cssVariables);
    console.log('CSS variables generated successfully!');
  } catch (error) {
    console.error('Error processing tokens:', error);
  }
}

// Run the conversion
convertTokensToCssVariables(); 