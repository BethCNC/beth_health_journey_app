import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TokenDisplay from './TokenDisplay';

const meta: Meta<typeof TokenDisplay> = {
  title: 'Design System/Tokens',
  component: TokenDisplay,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    category: {
      control: 'select',
      options: ['colors', 'spacing', 'radius', 'typography'],
      description: 'Token category to display',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Display theme',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TokenDisplay>;

export const Colors: Story = {
  args: {
    category: 'colors',
    theme: 'light',
  },
};

export const ColorsDark: Story = {
  args: {
    category: 'colors',
    theme: 'dark',
  },
};

export const Spacing: Story = {
  args: {
    category: 'spacing',
    theme: 'light',
  },
};

export const BorderRadius: Story = {
  args: {
    category: 'radius',
    theme: 'light',
  },
};

export const Typography: Story = {
  args: {
    category: 'typography',
    theme: 'light',
  },
}; 