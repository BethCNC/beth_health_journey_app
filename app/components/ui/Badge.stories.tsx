import { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      // Replace with your actual Figma file URL
      url: 'https://www.figma.com/file/your-file-id?node-id=badge-component',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

// Base Badge story
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
};

// Variant stories
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// Size stories
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// Rounded badges
export const Rounded: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge rounded>Default Rounded</Badge>
      <Badge variant="primary" rounded>Primary Rounded</Badge>
      <Badge variant="success" rounded>Success Rounded</Badge>
    </div>
  ),
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge icon={<span>✓</span>}>With Check</Badge>
      <Badge variant="primary" icon={<span>★</span>}>With Star</Badge>
      <Badge variant="warning" icon={<span>⚠️</span>}>Warning</Badge>
    </div>
  ),
};

// Showcase all variants and sizes
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small</h3>
        <div className="flex flex-wrap gap-2">
          <Badge size="sm" variant="default">Default</Badge>
          <Badge size="sm" variant="primary">Primary</Badge>
          <Badge size="sm" variant="success">Success</Badge>
          <Badge size="sm" variant="warning">Warning</Badge>
          <Badge size="sm" variant="error">Error</Badge>
          <Badge size="sm" variant="info">Info</Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Medium</h3>
        <div className="flex flex-wrap gap-2">
          <Badge size="md" variant="default">Default</Badge>
          <Badge size="md" variant="primary">Primary</Badge>
          <Badge size="md" variant="success">Success</Badge>
          <Badge size="md" variant="warning">Warning</Badge>
          <Badge size="md" variant="error">Error</Badge>
          <Badge size="md" variant="info">Info</Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large</h3>
        <div className="flex flex-wrap gap-2">
          <Badge size="lg" variant="default">Default</Badge>
          <Badge size="lg" variant="primary">Primary</Badge>
          <Badge size="lg" variant="success">Success</Badge>
          <Badge size="lg" variant="warning">Warning</Badge>
          <Badge size="lg" variant="error">Error</Badge>
          <Badge size="lg" variant="info">Info</Badge>
        </div>
      </div>
    </div>
  ),
}; 