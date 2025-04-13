import { Meta } from '@storybook/react';
import { colors, typography, spacing, radius, shadows, opacity } from './tokens';

const meta: Meta = {
  title: 'Design Tokens',
  parameters: {
    design: {
      type: 'figma',
      // Replace with your Figma file URL that contains design tokens
      url: 'https://www.figma.com/file/your-file-id?node-id=colors-section',
    },
    docsOnly: true,
  },
};

export default meta;

// Helper function to create a token display
const TokenDisplay = ({ name, value, style = {} }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '8px', 
    padding: '8px',
    border: '1px solid #eee',
    borderRadius: '4px'
  }}>
    <div style={{ 
      ...style, 
      width: '50px', 
      height: '50px', 
      marginRight: '16px',
      border: '1px solid #eee',
      borderRadius: '4px'
    }} />
    <div>
      <div style={{ fontWeight: 'bold' }}>{name}</div>
      <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
    </div>
  </div>
);

// Color tokens
export const Colors = () => {
  return (
    <div>
      <h1>Colors</h1>
      
      <h2>Primary Colors</h2>
      {Object.entries(colors.primary).map(([key, value]) => (
        <TokenDisplay 
          key={key}
          name={`primary.${key}`}
          value={value}
          style={{ backgroundColor: value }}
        />
      ))}
      
      <h2>Gray Colors</h2>
      {Object.entries(colors.gray).map(([key, value]) => (
        <TokenDisplay 
          key={key}
          name={`gray.${key}`}
          value={value}
          style={{ backgroundColor: value }}
        />
      ))}
      
      <h2>Semantic Colors</h2>
      <h3>Text</h3>
      {Object.entries(colors.text).map(([key, value]) => (
        <TokenDisplay 
          key={key}
          name={`text.${key}`}
          value={value}
          style={{ backgroundColor: value }}
        />
      ))}
      
      <h3>Surface</h3>
      {Object.entries(colors.surface).map(([key, value]) => (
        <TokenDisplay 
          key={key}
          name={`surface.${key}`}
          value={value}
          style={{ backgroundColor: value }}
        />
      ))}
      
      <h2>Status Colors</h2>
      {Object.entries(colors.status).map(([key, value]) => (
        <TokenDisplay 
          key={key}
          name={`status.${key}`}
          value={value}
          style={{ backgroundColor: value }}
        />
      ))}
    </div>
  );
};

// Typography tokens
export const Typography = () => {
  return (
    <div>
      <h1>Typography</h1>
      
      <h2>Font Family</h2>
      {Object.entries(typography.fontFamily).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold' }}>{`fontFamily.${key}`}</div>
          <div style={{ 
            fontFamily: value, 
            fontSize: '18px',
            marginTop: '8px'
          }}>
            The quick brown fox jumps over the lazy dog
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
        </div>
      ))}
      
      <h2>Font Size</h2>
      {Object.entries(typography.fontSize).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold' }}>{`fontSize.${key}`}</div>
          <div style={{ 
            fontSize: value,
            marginTop: '8px'
          }}>
            The quick brown fox jumps over the lazy dog
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
        </div>
      ))}
      
      <h2>Font Weight</h2>
      {Object.entries(typography.fontWeight).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold' }}>{`fontWeight.${key}`}</div>
          <div style={{ 
            fontWeight: value,
            fontSize: '18px',
            marginTop: '8px'
          }}>
            The quick brown fox jumps over the lazy dog
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
        </div>
      ))}
      
      <h2>Line Height</h2>
      {Object.entries(typography.lineHeight).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '24px' }}>
          <div style={{ fontWeight: 'bold' }}>{`lineHeight.${key}`}</div>
          <div style={{ 
            lineHeight: value,
            marginTop: '8px',
            backgroundColor: '#f6f6f6',
            padding: '8px'
          }}>
            The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
        </div>
      ))}
    </div>
  );
};

// Spacing tokens
export const Spacing = () => {
  return (
    <div>
      <h1>Spacing</h1>
      {Object.entries(spacing).map(([key, value]) => (
        <div key={key} style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ 
            width: value, 
            height: '24px', 
            backgroundColor: '#0066FF',
            marginRight: '16px'
          }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{`spacing.${key}`}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Border radius tokens
export const BorderRadius = () => {
  return (
    <div>
      <h1>Border Radius</h1>
      {Object.entries(radius).map(([key, value]) => (
        <div key={key} style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: '#0066FF',
            borderRadius: value,
            marginRight: '16px'
          }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{`radius.${key}`}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Shadow tokens
export const Shadows = () => {
  return (
    <div>
      <h1>Shadows</h1>
      {Object.entries(shadows).map(([key, value]) => (
        <div key={key} style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: 'white',
            boxShadow: value,
            marginRight: '24px'
          }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{`shadows.${key}`}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Opacity tokens
export const Opacities = () => {
  return (
    <div>
      <h1>Opacity</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {Object.entries(opacity).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: '#0066FF',
              opacity: Number(key) / 100,
              marginBottom: '8px'
            }} />
            <div style={{ fontWeight: 'bold' }}>{`opacity.${key}`}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 