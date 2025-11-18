import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import FileUpload from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

// Default FileUpload
export const Default: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file),
    onError: (error) => console.error('Error:', error),
  },
};

// With State Management
export const Interactive: Story = {
  render: () => {
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
      <div style={{ width: '500px' }}>
        <FileUpload
          onFileSelect={(file) => {
            setSelectedFile(file);
            setError('');
            console.log('File selected:', file.name);
          }}
          onError={(err) => {
            setError(err);
            console.error('Error:', err);
          }}
        />
        {selectedFile && !error && (
          <div style={{ marginTop: '16px', color: '#10b981' }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </div>
        )}
        {error && <div style={{ marginTop: '16px', color: '#ef4444' }}>Error: {error}</div>}
      </div>
    );
  },
};

// Uploading State
export const Uploading: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file),
    isUploading: true,
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file),
    disabled: true,
  },
};

// With Success Message
export const WithSuccess: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file),
    successMessage: 'Invoice uploaded and analyzed successfully!',
  },
};

// Error Handling Demo
export const ErrorHandling: Story = {
  render: () => {
    const [error, setError] = useState('');

    return (
      <div style={{ width: '500px' }}>
        <FileUpload
          onFileSelect={(file) => {
            console.log('File selected:', file);
            setError('');
          }}
          onError={(err) => {
            setError(err);
          }}
        />
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#9ca3af' }}>Validation Rules:</h4>
          <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#9ca3af', fontSize: '0.875rem' }}>
            <li>Only JPG/JPEG files</li>
            <li>Maximum size: 5MB</li>
            <li>File must not be empty</li>
          </ul>
          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Complete Upload Flow
export const CompleteFlow: Story = {
  render: () => {
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (file: File) => {
      setError('');
      setSuccess(false);
      setIsUploading(true);

      // Simulate API call
      setTimeout(() => {
        setIsUploading(false);
        setSuccess(true);
        console.log('Upload complete:', file.name);
      }, 2000);
    };

    return (
      <div style={{ width: '500px' }}>
        <FileUpload
          onFileSelect={handleFileSelect}
          onError={(err) => {
            setError(err);
            setSuccess(false);
          }}
          isUploading={isUploading}
          successMessage={success ? 'Invoice analyzed successfully!' : ''}
        />
        {error && <p style={{ color: '#dc2626', marginTop: '8px' }}>{error}</p>}
      </div>
    );
  },
};

// In a Card
export const InCard: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        padding: '24px',
        background: '#374151',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)',
      }}
    >
      <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#ffffff' }}>Upload Invoice</h2>
      <p style={{ margin: '0 0 24px 0', color: '#9ca3af', fontSize: '0.9375rem' }}>
        Upload an invoice image to automatically extract expense details.
      </p>
      <FileUpload
        onFileSelect={(file) => console.log('File selected:', file)}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  ),
};

// Multiple Instances
export const MultipleInstances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column', width: '500px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>Upload Receipt</h3>
        <FileUpload
          onFileSelect={(file) => console.log('Receipt selected:', file)}
          onError={(error) => console.error('Receipt error:', error)}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>Upload Contract</h3>
        <FileUpload
          onFileSelect={(file) => console.log('Contract selected:', file)}
          onError={(error) => console.error('Contract error:', error)}
        />
      </div>
    </div>
  ),
};

// Compact Version
export const Compact: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <FileUpload
        onFileSelect={(file) => console.log('File selected:', file)}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  ),
};
