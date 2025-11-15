import type { Meta, StoryObj } from '@storybook/react-vite';
import DatePicker from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A DatePicker component that handles date selection with validation, min/max constraints, and ISO date formatting. Integrates seamlessly with forms and provides comprehensive date input functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current date value in ISO format (YYYY-MM-DD)',
    },
    min: {
      control: 'text',
      description: 'Minimum selectable date in ISO format',
    },
    max: {
      control: 'text',
      description: 'Maximum selectable date in ISO format',
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
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic date picker
export const Default: Story = {
  args: {
    'aria-label': 'Select date',
  },
};

// With initial value
export const WithValue: Story = {
  args: {
    value: '2024-01-15',
    'aria-label': 'Select date',
  },
};

// With min/max constraints
export const WithConstraints: Story = {
  args: {
    min: '2024-01-01',
    max: '2024-12-31',
    value: '2024-06-15',
    'aria-label': 'Select date within 2024',
  },
};

// Current date constraints
export const CurrentDateRange: Story = {
  render: () => {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const max = maxDate.toISOString().split('T')[0];

    return <DatePicker min={today} max={max} aria-label="Select date (today to next 30 days)" />;
  },
};

// Past dates only
export const PastDatesOnly: Story = {
  render: () => {
    const today = new Date().toISOString().split('T')[0];
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    const min = minDate.toISOString().split('T')[0];

    return <DatePicker min={min} max={today} aria-label="Select past date" />;
  },
};

// Required field
export const Required: Story = {
  args: {
    required: true,
    'aria-label': 'Select date (required)',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    value: '2024-01-15',
    'aria-label': 'Date (disabled)',
  },
};

// Form integration examples
export const ExpenseForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '300px',
        padding: '1.5rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0' }}>Add Expense</h3>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Date *
        </label>
        <DatePicker required name="date" aria-label="Expense date" />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Amount *
        </label>
        <input
          type="number"
          placeholder="0.00"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Description
        </label>
        <input
          type="text"
          placeholder="Enter description"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
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
        Add Expense
      </button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const DateRangeForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '400px',
        padding: '1.5rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0' }}>Filter Expenses</h3>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            From Date
          </label>
          <DatePicker name="fromDate" aria-label="From date" />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            To Date
          </label>
          <DatePicker name="toDate" aria-label="To date" />
        </div>
      </div>

      <button
        style={{
          padding: '0.75rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          marginTop: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Apply Filter
      </button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

// Different date scenarios
export const DateScenarios: Story = {
  render: () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          padding: '1rem',
        }}
      >
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Today&apos;s Date</h4>
          <DatePicker value={today} aria-label="Today's date" />
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Yesterday</h4>
          <DatePicker value={yesterdayStr} aria-label="Yesterday's date" />
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Future Date (Next Week)</h4>
          <DatePicker value={nextWeekStr} aria-label="Future date" />
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Business Days Only (Mon-Fri)</h4>
          <DatePicker min={today} aria-label="Business days only" />
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
            Note: This would require additional logic to restrict weekends
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
