import type { Meta, StoryObj } from '@storybook/react-vite';
import PasswordInput from './PasswordInput';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A specialized password input component with show/hide toggle functionality. Provides enhanced UX for password fields with eye icon to toggle visibility and comprehensive form integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
    id: {
      control: 'text',
      description: 'HTML id attribute',
    },
    name: {
      control: 'text',
      description: 'HTML name attribute',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label',
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic password input
export const Default: Story = {
  args: {
    placeholder: 'Enter password',
  },
};

// With placeholder variations
export const CreatePassword: Story = {
  args: {
    placeholder: 'Create password',
    'aria-label': 'Create new password',
  },
};

export const ConfirmPassword: Story = {
  args: {
    placeholder: 'Confirm password',
    'aria-label': 'Confirm password',
  },
};

export const CurrentPassword: Story = {
  args: {
    placeholder: 'Current password',
    'aria-label': 'Enter current password',
  },
};

// Required field
export const Required: Story = {
  args: {
    placeholder: 'Password (required)',
    required: true,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: 'Password (disabled)',
    disabled: true,
    defaultValue: 'disabled-password',
  },
};

// Form integration examples
export const LoginForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '300px',
        padding: '2rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Sign In</h3>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Email *
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Password *
        </label>
        <PasswordInput placeholder="Enter password" required name="password" />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" />
          Remember me
        </label>
        <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
          Forgot password?
        </a>
      </div>

      <button
        style={{
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          marginTop: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Sign In
      </button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const SignUpForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '350px',
        padding: '2rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Create Account</h3>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            First Name *
          </label>
          <input
            type="text"
            placeholder="First name"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Last Name *
          </label>
          <input
            type="text"
            placeholder="Last name"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Email *
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Password *
        </label>
        <PasswordInput placeholder="Create password" required name="password" />
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
          At least 8 characters with letters and numbers
        </p>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Confirm Password *
        </label>
        <PasswordInput placeholder="Confirm password" required name="confirmPassword" />
      </div>

      <button
        style={{
          padding: '0.75rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          marginTop: '1rem',
          cursor: 'pointer',
        }}
      >
        Create Account
      </button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const PasswordChangeForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '350px',
        padding: '2rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Change Password</h3>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Current Password *
        </label>
        <PasswordInput placeholder="Enter current password" required name="currentPassword" />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          New Password *
        </label>
        <PasswordInput placeholder="Enter new password" required name="newPassword" />
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
          Password must be different from current password
        </p>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Confirm New Password *
        </label>
        <PasswordInput placeholder="Confirm new password" required name="confirmNewPassword" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Update Password
        </button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

// Toggle functionality demonstration
export const ToggleDemonstration: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '400px',
      }}
    >
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Password with Default Value</h4>
        <PasswordInput placeholder="Password" defaultValue="example-password-123" />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Click the eye icon to toggle password visibility
        </p>
      </div>

      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Complex Password Example</h4>
        <PasswordInput placeholder="Complex password" defaultValue="MyStr0ng!P@ssw0rd#2024" />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Shows how special characters and numbers are handled
        </p>
      </div>

      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Short Password</h4>
        <PasswordInput placeholder="Short password" defaultValue="123" />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Demonstrates visibility toggle with short content
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
