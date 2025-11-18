import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import UploadInvoiceModal from './UploadInvoiceModal';
import Button from '../Button';

const meta: Meta<typeof UploadInvoiceModal> = {
  title: 'Components/UploadInvoiceModal',
  component: UploadInvoiceModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UploadInvoiceModal>;

// Default Modal
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Upload Modal</Button>
        <UploadInvoiceModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={(data) => {
            console.log('Invoice data:', data);
            alert(
              `Success!\nName: ${data.name}\nAmount: ${data.amount}\nCurrency: ${data.currency}\nDate: ${data.date}`,
            );
          }}
        />
      </>
    );
  },
};

// Always Open (for development)
export const AlwaysOpen: Story = {
  render: () => (
    <UploadInvoiceModal
      isOpen={true}
      onClose={() => console.log('Close clicked')}
      onSuccess={(data) => {
        console.log('Invoice data:', data);
        alert(JSON.stringify(data, null, 2));
      }}
    />
  ),
};

// With Mock Success
export const WithMockSuccess: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Upload Modal</Button>
        <UploadInvoiceModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={(data) => {
            console.log('Mock invoice data:', data);
            alert(
              `Invoice Analyzed!\n\n` +
                `Name: ${data.name}\n` +
                `Amount: ${data.amount} ${data.currency || 'USD'}\n` +
                `Date: ${data.date}\n\n` +
                `This would now pre-fill the expense form.`,
            );
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};

// In Application Context
export const InApplicationContext: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expenses, setExpenses] = useState<
      Array<{
        name: string;
        amount: number;
        currency?: string;
        date: string;
      }>
    >([]);

    const handleSuccess = (data: {
      name: string;
      amount: number;
      currency?: string;
      date: string;
    }) => {
      // Add to expenses list
      setExpenses([...expenses, data]);
      console.log('Added expense:', data);
    };

    return (
      <div
        style={{
          width: '800px',
          padding: '24px',
          background: '#1f2937',
          borderRadius: '12px',
          color: '#ffffff',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0' }}>Expense Tracker</h2>
          <p style={{ margin: 0, color: '#9ca3af' }}>
            Upload invoices to automatically create expenses
          </p>
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <Button onClick={() => setIsOpen(true)}>📄 Upload Invoice</Button>
          <Button variant="secondary">➕ Add Manually</Button>
        </div>

        <div
          style={{
            background: '#374151',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '200px',
          }}
        >
          {expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
              <p>No expenses yet. Upload an invoice to get started!</p>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 16px 0' }}>Recent Expenses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      background: '#1f2937',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{expense.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{expense.date}</div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#3b82f6' }}>
                      {expense.amount} {expense.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <UploadInvoiceModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={handleSuccess}
        />
      </div>
    );
  },
};
