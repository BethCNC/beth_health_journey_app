import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    isFullWidth: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>;

// Create a template for the stories
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

// Primary Button
export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Primary Button',
};

// Secondary Button
export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary Button',
};

// Outline Button
export const Outline = Template.bind({});
Outline.args = {
  variant: 'outline',
  children: 'Outline Button',
};

// Text Button
export const Text = Template.bind({});
Text.args = {
  variant: 'text',
  children: 'Text Button',
};

// Loading Button
export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  children: 'Loading...',
};

// Disabled Button
export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  children: 'Disabled Button',
};

// Small Button
export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Small Button',
};

// Large Button
export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Large Button',
};

// Full Width Button
export const FullWidth = Template.bind({});
FullWidth.args = {
  isFullWidth: true,
  children: 'Full Width Button',
}; 