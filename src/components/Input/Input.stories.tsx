import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible Input component supporting various types, validation states, and helper text. Features error and success states with customizable styling and comprehensive form integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'HTML input type',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant indicating validation state',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the input field',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when variant is error',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic input types
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email address...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
};

// Input variants
export const WithHelperText: Story = {
  args: {
    placeholder: 'Username',
    helperText: 'Choose a unique username',
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'error',
    placeholder: 'Enter valid email',
    errorMessage: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

export const SuccessState: Story = {
  args: {
    variant: 'success',
    placeholder: 'Enter email',
    helperText: 'Email looks good!',
    defaultValue: 'user@example.com',
  },
};

// Input states
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    defaultValue: 'This field is disabled',
  },
};

export const Required: Story = {
  args: {
    placeholder: 'Required field',
    required: true,
    helperText: 'This field is required',
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: 'Read-only input',
    readOnly: true,
    defaultValue: 'This value cannot be changed',
  },
};

// Input sizes
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium input',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large input',
  },
};

// Complex examples
export const WithValidation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input
        type="email"
        placeholder="Email"
        variant="default"
        helperText="Enter a valid email address"
      />
      <Input
        type="email"
        placeholder="Email"
        variant="error"
        errorMessage="Email is required"
        defaultValue=""
      />
      <Input
        type="email"
        placeholder="Email"
        variant="success"
        helperText="Email is valid!"
        defaultValue="user@example.com"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Form example
export const FormFields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input type="text" placeholder="First Name" required />
      <Input type="text" placeholder="Last Name" required />
      <Input type="email" placeholder="Email Address" required />
      <Input type="tel" placeholder="Phone Number" helperText="Optional" />
      <Input type="password" placeholder="Password" required />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input size="small" placeholder="Small input" />
      <Input size="medium" placeholder="Medium input" />
      <Input size="large" placeholder="Large input" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
