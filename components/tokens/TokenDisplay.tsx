import React from 'react';
import tokens from '../../styles/tokens.json';

interface TokenDisplayProps {
  category: 'colors' | 'spacing' | 'radius' | 'typography';
  theme?: 'light' | 'dark';
}

// Helper function to format token values
const formatTokenValue = (value: string | number): string => {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  
  // Format rem values to pixels for better readability
  if (typeof value === 'string' && value.endsWith('rem')) {
    const remValue = parseFloat(value.replace('rem', ''));
    return `${value} (${Math.round(remValue * 16)}px)`;
  }
  return String(value);
};

// Extract numeric value from token reference strings like "{Dimensions.Number Scale.100s.200 (8)}"
const extractNumericValue = (tokenReference: string): number => {
  // Check if it has a pattern like "(8)" or "(16)" in it - the pixel value in parentheses
  const match = tokenReference.match(/\((\d+)\)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Extract color tokens from the design tokens
const extractColors = (theme: 'light' | 'dark') => {
  const colorTokens: Record<string, string> = {};
  
  // Brand colors
  if (tokens.Brand?.Colors) {
    Object.entries(tokens.Brand.Colors).forEach(([category, values]) => {
      if (typeof values === 'object' && values !== null) {
        // Handle nested color scales (like Neutral.100, Neutral.200, etc.)
        Object.entries(values).forEach(([shade, value]) => {
          if (value && typeof value === 'object' && '$value' in value && '$type' in value && (value as any).$type === 'color') {
            colorTokens[`${category}.${shade}`] = (value as any).$value as string;
          }
        });
      } else if (values && typeof values === 'object' && '$value' in values && '$type' in values && (values as any).$type === 'color') {
        // Handle direct color values like Black, White
        colorTokens[category] = (values as any).$value as string;
      }
    });
  }
  
  // Mapped colors (semantic colors)
  const mappedTokensPath = theme === 'light' ? 'Mapped/light' : 'Mapped/dark';
  if (tokens[mappedTokensPath as keyof typeof tokens]) {
    const extractNestedColors = (obj: any, prefix = ''): void => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === 'object' && '$value' in value && '$type' in value && (value as any).$type === 'color') {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          colorTokens[fullKey] = (value as any).$value as string;
        } else if (value && typeof value === 'object' && !('$value' in value)) {
          const newPrefix = prefix ? `${prefix}.${key}` : key;
          extractNestedColors(value, newPrefix);
        }
      });
    };
    
    extractNestedColors(tokens[mappedTokensPath as keyof typeof tokens]);
  }
  
  return colorTokens;
};

// Extract spacing tokens
const extractSpacingTokens = () => {
  const spacingTokens: Record<string, number> = {};
  
  // Extract space-* tokens from dimensions if it exists
  const tokensAny = tokens as any;
  if (tokensAny.dimensions?.spacing) {
    Object.entries(tokensAny.dimensions.spacing).forEach(([key, value]: [string, any]) => {
      if (value && typeof value === 'object' && '$value' in value) {
        const tokenRef = value.$value as string;
        spacingTokens[key] = extractNumericValue(tokenRef);
      }
    });
  }
  
  // Extract component-specific padding tokens
  const componentCategories = [
    'Component Tokens/small',
    'Component Tokens/default'
  ];
  
  componentCategories.forEach(category => {
    if (tokensAny[category]) {
      const components = ['button', 'layout', 'card'];
      
      components.forEach(component => {
        if (tokensAny[category][component]) {
          // Look for padding-related tokens
          ['h-padding', 'v-padding', 'full-padding', 'spacing'].forEach(tokenType => {
            if (tokensAny[category][component][tokenType] && 
                typeof tokensAny[category][component][tokenType] === 'object' && 
                '$value' in tokensAny[category][component][tokenType]) {
              const tokenRef = tokensAny[category][component][tokenType].$value as string;
              const tokenKey = `${category.split('/')[1]}.${component}.${tokenType}`;
              spacingTokens[tokenKey] = extractNumericValue(tokenRef);
            }
          });
        }
      });
    }
  });
  
  return spacingTokens;
};

// Extract border radius tokens
const extractRadiusTokens = () => {
  const radiusTokens: Record<string, number> = {};
  
  // Extract radius tokens from dimensions if it exists
  const tokensAny = tokens as any;
  if (tokensAny.dimensions?.radius) {
    Object.entries(tokensAny.dimensions.radius).forEach(([key, value]: [string, any]) => {
      if (value && typeof value === 'object' && '$value' in value) {
        const tokenRef = value.$value as string;
        radiusTokens[key] = extractNumericValue(tokenRef);
      }
    });
  }
  
  // Extract component-specific radius tokens
  const componentCategories = [
    'Component Tokens/small',
    'Component Tokens/default'
  ];
  
  componentCategories.forEach(category => {
    if (tokensAny[category]) {
      const components = ['button', 'layout', 'card'];
      
      components.forEach(component => {
        if (tokensAny[category][component]?.radius && 
            typeof tokensAny[category][component].radius === 'object' && 
            '$value' in tokensAny[category][component].radius) {
          const tokenRef = tokensAny[category][component].radius.$value as string;
          const tokenKey = `${category.split('/')[1]}.${component}.radius`;
          radiusTokens[tokenKey] = extractNumericValue(tokenRef);
        }
      });
    }
  });
  
  return radiusTokens;
};

// Extract typography tokens - placeholder implementation
const extractTypographyTokens = () => {
  // This would need to be expanded based on the actual typography token structure
  return {
    // Placeholder for now
    'heading-1': { size: '24px', weight: '700', lineHeight: '1.2' },
    'body': { size: '16px', weight: '400', lineHeight: '1.5' }
  };
};

// Component to display a color swatch
const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex items-center mb-4">
    <div 
      className="w-16 h-16 rounded shadow-md mr-4" 
      style={{ backgroundColor: value }}
    />
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{value}</p>
    </div>
  </div>
);

// Component to display a spacing swatch
const SpacingSwatch = ({ name, value }: { name: string; value: number }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-64 flex items-center">
        <div className="bg-blue-200 dark:bg-blue-800 h-8" style={{ width: value >= 4 ? value : 4 }} />
      </div>
      <div className="ml-4">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{formatTokenValue(value)}</p>
      </div>
    </div>
  );
};

// Component to display a radius swatch
const RadiusSwatch = ({ name, value }: { name: string; value: number }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div 
        className="w-24 h-24 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mb-2" 
        style={{ borderRadius: `${value}px` }}
      />
      <p className="font-semibold text-center">{name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{formatTokenValue(value)}</p>
    </div>
  );
};

// Component to display a typography sample
const TypographySwatch = ({ name, properties }: { name: string; properties: any }) => (
  <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
    <p className="font-semibold mb-2">{name}</p>
    <p style={{ 
      fontSize: properties.size, 
      fontWeight: properties.weight,
      lineHeight: properties.lineHeight
    }}>
      The quick brown fox jumps over the lazy dog
    </p>
    <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
      <p>Size: {properties.size}</p>
      <p>Weight: {properties.weight}</p>
      <p>Line Height: {properties.lineHeight}</p>
    </div>
  </div>
);

// Main component to display different token categories
const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  category = 'colors',
  theme = 'light'
}) => {
  // Apply theme class if needed
  const themeClass = theme === 'dark' ? 'bg-gray-900 text-white p-8' : 'bg-white text-gray-900 p-8';
  
  switch (category) {
    case 'colors': {
      const colorTokens = extractColors(theme);
      return (
        <div className={themeClass}>
          <h1 className="text-2xl font-bold mb-6">Color Tokens</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(colorTokens).map(([name, value]) => (
              <ColorSwatch key={name} name={name} value={value} />
            ))}
          </div>
        </div>
      );
    }
    
    case 'spacing': {
      const spacingTokens = extractSpacingTokens();
      return (
        <div className={themeClass}>
          <h1 className="text-2xl font-bold mb-6">Spacing Tokens</h1>
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-xl font-semibold mt-4 mb-2">Base Spacing Scale</h2>
            {Object.entries(spacingTokens)
              .filter(([key]) => key.startsWith('space-'))
              .sort((a, b) => a[1] - b[1])
              .map(([name, value]) => (
                <SpacingSwatch key={name} name={name} value={value} />
              ))
            }
            
            <h2 className="text-xl font-semibold mt-8 mb-2">Component Padding</h2>
            {Object.entries(spacingTokens)
              .filter(([key]) => key.includes('padding') || key.includes('spacing'))
              .sort((a, b) => a[1] - b[1])
              .map(([name, value]) => (
                <SpacingSwatch key={name} name={name} value={value} />
              ))
            }
          </div>
        </div>
      );
    }
    
    case 'radius': {
      const radiusTokens = extractRadiusTokens();
      return (
        <div className={themeClass}>
          <h1 className="text-2xl font-bold mb-6">Border Radius Tokens</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(radiusTokens)
              .sort((a, b) => a[1] - b[1])
              .map(([name, value]) => (
                <RadiusSwatch key={name} name={name} value={value} />
              ))
            }
          </div>
        </div>
      );
    }
    
    case 'typography': {
      const typographyTokens = extractTypographyTokens();
      return (
        <div className={themeClass}>
          <h1 className="text-2xl font-bold mb-6">Typography Tokens</h1>
          <div className="max-w-3xl">
            {Object.entries(typographyTokens).map(([name, properties]) => (
              <TypographySwatch key={name} name={name} properties={properties} />
            ))}
          </div>
        </div>
      );
    }
    
    default:
      return null;
  }
};

export default TokenDisplay; 