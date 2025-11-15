import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';
import Icon from '../Icon';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable Button component with multiple variants and states. Supports primary, secondary, outlined, close, and icon variants with different sizes. Includes loading, disabled, and active states for enhanced UX.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'close', 'icon'],
      description: 'Visual variant style',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state - shows spinner and disables button',
    },
    active: {
      control: 'boolean',
      description: 'Active state for toggle buttons',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    children: {
      control: 'text',
      description: 'Button text or child content',
    },
  },
  args: {
    onClick: () => console.log('Button clicked'),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

// Button sizes
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

// Button states
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Active: Story = {
  args: {
    variant: 'primary',
    active: true,
    children: 'Active Button',
  },
};

// Button with icons
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Button with Icon',
    icon: <Icon iconName="plus" size="small" />,
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Button with End Icon',
    endIcon: <Icon iconName="plus" size="small" />,
  },
};

// Icon only button
export const IconOnly: Story = {
  args: {
    variant: 'icon',
    'aria-label': 'Add item',
    children: <Icon iconName="plus" size="medium" />,
  },
};

// Close button
export const Close: Story = {
  args: {
    variant: 'close',
    'aria-label': 'Close dialog',
    children: <Icon iconName="close" size="medium" />,
  },
};

// Full width button
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="close" aria-label="Close">
        <Icon iconName="close" size="medium" />
      </Button>
      <Button variant="icon" aria-label="Add">
        <Icon iconName="plus" size="medium" />
      </Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button variant="primary" size="small">
        Small
      </Button>
      <Button variant="primary" size="medium">
        Medium
      </Button>
      <Button variant="primary" size="large">
        Large
      </Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
