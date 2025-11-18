import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Modal from './Modal';
import Button from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

interface ModalWrapperProps extends Partial<React.ComponentProps<typeof Modal>> {
  children?: React.ReactNode;
}

// Helper component for interactive stories
const ModalWrapper = (args: ModalWrapperProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

// Basic Modal
export const Default: Story = {
  render: () => (
    <ModalWrapper title="Default Modal">
      <p>This is a basic modal with default settings.</p>
    </ModalWrapper>
  ),
};

// Modal with Footer
export const WithFooter: Story = {
  render: () => (
    <ModalWrapper
      title="Confirm Action"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </>
      }
    >
      <p>Are you sure you want to perform this action?</p>
    </ModalWrapper>
  ),
};

// Different Sizes
export const SmallModal: Story = {
  render: () => (
    <ModalWrapper title="Small Modal" maxWidth="sm">
      <p>This is a small modal.</p>
    </ModalWrapper>
  ),
};

export const MediumModal: Story = {
  render: () => (
    <ModalWrapper title="Medium Modal" maxWidth="md">
      <p>This is a medium modal (default size).</p>
    </ModalWrapper>
  ),
};

export const LargeModal: Story = {
  render: () => (
    <ModalWrapper title="Large Modal" maxWidth="lg">
      <p>This is a large modal with more content space.</p>
      <p>It can contain more information and larger forms.</p>
    </ModalWrapper>
  ),
};

export const ExtraLargeModal: Story = {
  render: () => (
    <ModalWrapper title="Extra Large Modal" maxWidth="xl">
      <p>This is an extra large modal for complex content.</p>
      <p>Perfect for detailed forms or data tables.</p>
    </ModalWrapper>
  ),
};

// Form Example
export const FormModal: Story = {
  render: () => (
    <ModalWrapper
      title="Create New Expense"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            Expense Name
          </label>
          <input
            type="text"
            placeholder="Enter expense name"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #4b5563',
              background: '#1f2937',
              color: '#ffffff',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Amount</label>
          <input
            type="number"
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #4b5563',
              background: '#1f2937',
              color: '#ffffff',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
            Category
          </label>
          <select
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #4b5563',
              background: '#1f2937',
              color: '#ffffff',
            }}
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
          </select>
        </div>
      </div>
    </ModalWrapper>
  ),
};

// Long Content (Scrollable)
export const LongContent: Story = {
  render: () => (
    <ModalWrapper title="Terms and Conditions">
      <div style={{ lineHeight: '1.6' }}>
        <h3>1. Introduction</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        <h3>2. User Agreement</h3>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
        <h3>3. Privacy Policy</h3>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco...</p>
        <h3>4. Data Collection</h3>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit...</p>
        <h3>5. Cookies</h3>
        <p>Excepteur sint occaecat cupidatat non proident...</p>
        <h3>6. Third Party Services</h3>
        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum...</p>
      </div>
    </ModalWrapper>
  ),
};

// Confirmation Dialog
export const ConfirmationDialog: Story = {
  render: () => (
    <ModalWrapper
      title="Delete Expense"
      maxWidth="sm"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Delete</Button>
        </>
      }
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        <p>Are you sure you want to delete this expense?</p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '8px' }}>
          This action cannot be undone.
        </p>
      </div>
    </ModalWrapper>
  ),
};

// Loading State
export const LoadingState: Story = {
  render: () => (
    <ModalWrapper title="Processing" maxWidth="sm">
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px',
          }}
        />
        <p>Processing your request...</p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '8px' }}>Please wait</p>
      </div>
    </ModalWrapper>
  ),
};

// No Backdrop Click Close
export const NoBackdropClose: Story = {
  render: () => (
    <ModalWrapper title="Cannot Close by Clicking Outside" closeOnBackdropClick={false}>
      <p>This modal can only be closed by clicking the X button or pressing Escape.</p>
    </ModalWrapper>
  ),
};

// No Escape Key Close
export const NoEscapeClose: Story = {
  render: () => (
    <ModalWrapper title="Cannot Close with Escape Key" closeOnEscape={false}>
      <p>This modal cannot be closed by pressing the Escape key.</p>
    </ModalWrapper>
  ),
};
