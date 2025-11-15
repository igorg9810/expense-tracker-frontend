import type { Meta, StoryObj } from '@storybook/react-vite';
import Loader from './Loader';

const meta = {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A table skeleton loader component that displays animated placeholder rows while data is loading. Configurable number of rows to match the expected content layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: 'number',
      description: 'Number of skeleton rows to display',
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default loader
export const Default: Story = {
  args: {
    rows: 5,
  },
};

// Different row counts
export const SingleRow: Story = {
  args: {
    rows: 1,
  },
};

export const ThreeRows: Story = {
  args: {
    rows: 3,
  },
};

export const FiveRows: Story = {
  args: {
    rows: 5,
  },
};

export const TenRows: Story = {
  args: {
    rows: 10,
  },
};

// Comparison of different row counts
export const RowComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      <div>
        <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>1 Row</h4>
        <Loader rows={1} />
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>3 Rows</h4>
        <Loader rows={3} />
      </div>
      <div>
        <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>5 Rows</h4>
        <Loader rows={5} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Usage in different contexts
export const InCard: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Expense Data</h3>
      <Loader rows={4} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const InExpenseTable: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 'bold',
        }}
      >
        Recent Expenses
      </div>
      <div style={{ padding: '1rem' }}>
        <Loader rows={6} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const FullPageLoading: Story = {
  render: () => (
    <div
      style={{
        minHeight: '400px',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div
            style={{
              width: '100px',
              height: '40px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            }}
          ></div>
        </div>
        <Loader rows={8} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
