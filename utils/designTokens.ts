import tokens from '../styles/tokens.json';

// Types for token categories
type ColorToken = string;
type SpacingToken = number;
type RadiusToken = number;
type TypographyToken = {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  fontFamily: string;
};

/**
 * Helper to extract the final value from a token reference
 * @param tokenValue The token value which might be a reference
 * @param tokenType The type of token (color, spacing, etc.)
 */
function resolveTokenValue(tokenValue: any, tokenType: string): any {
  if (!tokenValue) return null;
  
  // If it's a direct value with a $value property
  if (tokenValue.$value) {
    const value = tokenValue.$value;
    
    // Check if it's a reference to another token
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      // Remove curly braces and split by dots
      const path = value.slice(1, -1);
      const pathParts = path.split('.');
      
      let resolvedValue: any = tokens;
      for (const part of pathParts) {
        if (resolvedValue && typeof resolvedValue === 'object' && part in resolvedValue) {
          resolvedValue = resolvedValue[part];
        } else {
          return null; // Path doesn't exist
        }
      }
      
      // Recursively resolve if we got another reference
      return resolveTokenValue(resolvedValue, tokenType);
    }
    
    // For spacing and number values, extract pixel values if needed
    if (tokenType === 'spacing' || tokenType === 'radius') {
      if (typeof value === 'string') {
        const match = value.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : Number(value);
      }
      return Number(value);
    }
    
    return value;
  }
  
  return null;
}

/**
 * Get a color token by name from the semantic color tokens
 * Use the light theme by default but can be switched to dark
 */
export function getColor(tokenName: string, theme: 'light' | 'dark' = 'light'): ColorToken {
  const prefix = `Mapped/${theme}`;
  const parts = tokenName.split('.');
  
  // Navigate through the token structure
  const tokensAny = tokens as any;
  let currentObj = tokensAny[prefix];
  for (const part of parts) {
    if (currentObj && typeof currentObj === 'object' && part in currentObj) {
      currentObj = currentObj[part];
    } else {
      console.warn(`Color token not found: ${tokenName}`);
      return '';
    }
  }
  
  return resolveTokenValue(currentObj, 'color') || '';
}

/**
 * Get a spacing token value in pixels
 */
export function getSpacing(tokenName: string): SpacingToken {
  const tokensAny = tokens as any;
  if (!tokensAny.dimensions?.spacing) {
    console.warn('Spacing tokens not found');
    return 0;
  }
  
  const spacingToken = tokensAny.dimensions.spacing[tokenName];
  if (!spacingToken) {
    console.warn(`Spacing token not found: ${tokenName}`);
    return 0;
  }
  
  return resolveTokenValue(spacingToken, 'spacing') || 0;
}

/**
 * Get a border radius value in pixels
 */
export function getRadius(tokenName: string): RadiusToken {
  const tokensAny = tokens as any;
  if (!tokensAny.dimensions?.radius) {
    console.warn('Radius tokens not found');
    return 0;
  }
  
  const radiusToken = tokensAny.dimensions.radius[tokenName];
  if (!radiusToken) {
    console.warn(`Radius token not found: ${tokenName}`);
    return 0;
  }
  
  return resolveTokenValue(radiusToken, 'radius') || 0;
}

/**
 * Get component-specific token values
 * e.g., getComponentToken('button', 'h-padding')
 */
export function getComponentToken(component: string, tokenName: string): number {
  const componentPath = `Component Tokens/default/${component}`;
  
  // Navigate to the component section
  const parts = componentPath.split('/');
  const tokensAny = tokens as any;
  let currentObj = tokensAny;
  
  for (const part of parts) {
    if (currentObj && typeof currentObj === 'object' && part in currentObj) {
      currentObj = currentObj[part];
    } else {
      console.warn(`Component not found: ${component}`);
      return 0;
    }
  }
  
  // Get the specific token
  if (!currentObj || typeof currentObj !== 'object' || !(tokenName in currentObj)) {
    console.warn(`Token not found for ${component}: ${tokenName}`);
    return 0;
  }
  
  return resolveTokenValue(currentObj[tokenName], 'spacing') || 0;
}

/**
 * Export all token getters in a single object
 */
export const designTokens = {
  color: getColor,
  spacing: getSpacing,
  radius: getRadius,
  component: getComponentToken,
};

export default designTokens; 