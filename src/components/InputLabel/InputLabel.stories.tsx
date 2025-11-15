import type { Meta, StoryObj } from '@storybook/react-vite';
import InputLabel from './InputLabel';

const meta = {
  title: 'Components/InputLabel',
  component: InputLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable InputLabel component that provides consistent styling and accessibility for form labels. Supports required field indicators and integrates seamlessly with form inputs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text content',
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control (input id)',
    },
    required: {
      control: 'boolean',
      description: 'Shows required field indicator (asterisk)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic label
export const Default: Story = {
  args: {
    children: 'Email Address',
    htmlFor: 'email-input',
  },
};

// Required field label
export const Required: Story = {
  args: {
    children: 'Password',
    htmlFor: 'password-input',
    required: true,
  },
};

// Different label variations
export const ShortLabel: Story = {
  args: {
    children: 'Name',
    htmlFor: 'name-input',
  },
};

export const LongLabel: Story = {
  args: {
    children: 'Detailed Description of the Expense Item',
    htmlFor: 'description-input',
  },
};

export const OptionalLabel: Story = {
  args: {
    children: 'Phone Number (Optional)',
    htmlFor: 'phone-input',
  },
};

// Form field examples
export const WithTextInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
      <InputLabel htmlFor="text-input" required>
        Full Name
      </InputLabel>
      <input
        id="text-input"
        type="text"
        placeholder="Enter your full name"
        style={{
          padding: '0.75rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
        }}
      />
    </div>
  ),
};

export const WithEmailInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
      <InputLabel htmlFor="email-input" required>
        Email Address
      </InputLabel>
      <input
        id="email-input"
        type="email"
        placeholder="user@example.com"
        style={{
          padding: '0.75rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
        }}
      />
      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
        We&apos;ll use this to send you important updates
      </p>
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
      <InputLabel htmlFor="description-textarea">Description</InputLabel>
      <textarea
        id="description-textarea"
        placeholder="Provide additional details..."
        rows={4}
        style={{
          padding: '0.75rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
    </div>
  ),
};

export const WithSelectInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
      <InputLabel htmlFor="category-select" required>
        Expense Category
      </InputLabel>
      <select
        id="category-select"
        style={{
          padding: '0.75rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
          backgroundColor: 'white',
        }}
      >
        <option value="">Select a category</option>
        <option value="food">Food & Dining</option>
        <option value="transport">Transportation</option>
        <option value="utilities">Utilities</option>
        <option value="entertainment">Entertainment</option>
        <option value="healthcare">Healthcare</option>
        <option value="other">Other</option>
      </select>
    </div>
  ),
};

// Complete form example
export const CompleteForm: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '400px',
        padding: '2rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0' }}>Personal Information</h3>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <InputLabel htmlFor="first-name" required>
            First Name
          </InputLabel>
          <input
            id="first-name"
            type="text"
            placeholder="John"
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <InputLabel htmlFor="last-name" required>
            Last Name
          </InputLabel>
          <input
            id="last-name"
            type="text"
            placeholder="Doe"
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <InputLabel htmlFor="email" required>
          Email Address
        </InputLabel>
        <input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          required
          style={{
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <InputLabel htmlFor="phone">Phone Number</InputLabel>
        <input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          style={{
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
        <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
          Optional - used for account recovery
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <InputLabel htmlFor="bio">Bio</InputLabel>
        <textarea
          id="bio"
          placeholder="Tell us about yourself..."
          rows={3}
          style={{
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        Save Information
      </button>
    </form>
  ),
  parameters: {
    layout: 'centered',
  },
};

// Label alignment examples
export const LabelVariations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '400px',
      }}
    >
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Standard Labels</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <InputLabel htmlFor="standard1">Regular Field</InputLabel>
            <input
              id="standard1"
              type="text"
              placeholder="Enter value"
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <InputLabel htmlFor="standard2" required>
              Required Field
            </InputLabel>
            <input
              id="standard2"
              type="text"
              placeholder="Enter value"
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '1rem' }}>Inline Layout</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ minWidth: '100px' }}>
            <InputLabel htmlFor="inline-input">
              Inline Label:
            </InputLabel>
          </div>
          <input
            id="inline-input"
            type="text"
            placeholder="Enter value"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
