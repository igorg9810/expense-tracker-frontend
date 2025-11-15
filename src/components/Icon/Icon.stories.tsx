import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from './Icon';
import type { IconName } from '../../assets/icons';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile Icon component that displays SVG icons from a centralized registry. Supports multiple sizes and colors with consistent styling across the application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    iconName: {
      control: 'select',
      options: [
        'bell',
        'bank',
        'camera',
        'close',
        'plus',
        'search',
        'edit',
        'trash',
        'receipt',
        'coins',
        'mobile',
        'usb',
        'credit-card-plus',
        'water-drop',
        'paypal',
      ],
      description: 'Name of the icon to display',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the icon',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
      description: 'Color variant of the icon',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default icon
export const Default: Story = {
  args: {
    iconName: 'bell',
  },
};

// Icon sizes
export const Small: Story = {
  args: {
    iconName: 'bell',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    iconName: 'bell',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    iconName: 'bell',
    size: 'large',
  },
};

// Icon colors
export const Primary: Story = {
  args: {
    iconName: 'bell',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    iconName: 'bell',
    color: 'secondary',
  },
};

export const Success: Story = {
  args: {
    iconName: 'plus',
    color: 'success',
  },
};

export const Error: Story = {
  args: {
    iconName: 'close',
    color: 'error',
  },
};

// All available icons
export const AllIcons: Story = {
  args: { iconName: 'bell' },
  render: () => {
    const icons: IconName[] = [
      'bell',
      'bank',
      'camera',
      'close',
      'plus',
      'search',
      'edit',
      'trash',
      'receipt',
      'coins',
      'mobile',
      'usb',
      'credit-card-plus',
      'water-drop',
      'paypal',
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          maxWidth: '600px',
        }}
      >
        {icons.map((iconName) => (
          <div
            key={iconName}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          >
            <Icon iconName={iconName} size="medium" />
            <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{iconName}</span>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

// All sizes comparison
export const AllSizes: Story = {
  args: { iconName: 'bell' },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Icon iconName="bell" size="small" />
        <span style={{ fontSize: '0.8rem' }}>Small</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Icon iconName="bell" size="medium" />
        <span style={{ fontSize: '0.8rem' }}>Medium</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Icon iconName="bell" size="large" />
        <span style={{ fontSize: '0.8rem' }}>Large</span>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All colors comparison
export const AllColors: Story = {
  args: { iconName: 'bell' },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        padding: '1rem',
        flexWrap: 'wrap',
      }}
    >
      {['primary', 'secondary', 'success', 'error', 'warning', 'info'].map((color) => (
        <div
          key={color}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <Icon
            iconName="bell"
            color={color as 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'}
            size="medium"
          />
          <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{color}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Common use cases
export const CommonUseCases: Story = {
  args: { iconName: 'bell' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Navigation icons */}
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Navigation</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Icon iconName="bell" size="medium" />
          <Icon iconName="bank" size="medium" />
          <Icon iconName="search" size="medium" />
        </div>
      </div>

      {/* Action icons */}
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Actions</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Icon iconName="plus" size="medium" color="primary" />
          <Icon iconName="close" size="medium" color="error" />
          <Icon iconName="camera" size="medium" />
        </div>
      </div>

      {/* Status icons */}
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Status</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Icon iconName="plus" size="medium" color="success" />
          <Icon iconName="bell" size="medium" color="warning" />
          <Icon iconName="trash" size="medium" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
