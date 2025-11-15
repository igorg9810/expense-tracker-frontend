import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import Logo from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Logo component displays the application logo with navigation functionality. Integrates with React Router for seamless navigation and supports different sizes for various layout contexts.',
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'number',
      description: 'Width of the logo in pixels',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility',
    },
    href: {
      control: 'text',
      description: 'Navigation link URL',
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default logo
export const Default: Story = {
  args: {},
};

// Logo sizes
export const Small: Story = {
  args: {
    width: 80,
  },
};

export const Medium: Story = {
  args: {
    width: 120,
  },
};

export const Large: Story = {
  args: {
    width: 180,
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Logo width={80} />
        <span style={{ fontSize: '0.8rem', color: '#666' }}>Small (80px)</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Logo width={120} />
        <span style={{ fontSize: '0.8rem', color: '#666' }}>Medium (120px)</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Logo width={180} />
        <span style={{ fontSize: '0.8rem', color: '#666' }}>Large (180px)</span>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Logo in different contexts
export const InHeader: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Logo width={120} />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
          }}
        >
          Login
        </button>
        <button
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            background: '#007bff',
            color: 'white',
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const InSidebar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        height: '400px',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '250px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '1rem',
            borderBottom: '1px solid #34495e',
          }}
        >
          <Logo width={80} />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>
            Dashboard
          </a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>
            Expenses
          </a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>
            Reports
          </a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>
            Settings
          </a>
        </nav>
      </div>
      <div
        style={{
          flex: 1,
          padding: '2rem',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h2>Main Content Area</h2>
        <p>This shows how the logo appears in a sidebar navigation.</p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const InAuthForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 2rem',
        backgroundColor: '#f8f9fa',
        minHeight: '400px',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo width={120} />
          <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: '#666', margin: 0 }}>Sign in to your account</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
          <button
            style={{
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
