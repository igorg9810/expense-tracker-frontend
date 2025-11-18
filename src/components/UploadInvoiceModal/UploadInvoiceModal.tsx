import React, { useState } from 'react';
import Modal from '../Modal';
import FileUpload from '../FileUpload';
import Button from '../Button';
import { uploadInvoice, type InvoiceData } from '../../utils/api';
import styles from './UploadInvoiceModal.module.css';

export interface UploadInvoiceModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when invoice is successfully uploaded and analyzed */
  onSuccess: (data: InvoiceData) => void;
}

/**
 * UploadInvoiceModal Component
 *
 * Modal for uploading and analyzing invoice images.
 * Extracts expense data from invoices and provides it for form pre-filling.
 */
const UploadInvoiceModal: React.FC<UploadInvoiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Reset modal state
   */
  const resetState = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setError('');
    setSuccessMessage('');
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
    setSuccessMessage('');
  };

  /**
   * Handle file validation error
   */
  const handleFileError = (errorMessage: string) => {
    setError(errorMessage);
    setSelectedFile(null);
  };

  /**
   * Handle upload
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Upload and analyze invoice
      const invoiceData = await uploadInvoice(selectedFile);

      // Show success message
      setSuccessMessage('Invoice analyzed successfully!');

      // Wait a moment for user to see success
      setTimeout(() => {
        // Pass data to parent
        onSuccess(invoiceData);

        // Close modal and reset
        handleClose();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload invoice';
      setError(errorMessage);
      setIsUploading(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isUploading) {
      resetState();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Invoice"
      maxWidth="md"
      closeOnBackdropClick={!isUploading}
      closeOnEscape={!isUploading}
      footer={
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Analyzing...' : 'Upload & Analyze'}
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        <p className={styles.description}>
          Upload an invoice image (JPG format, max 5MB) to automatically extract expense details.
        </p>

        <FileUpload
          onFileSelect={handleFileSelect}
          onError={handleFileError}
          isUploading={isUploading}
          successMessage={successMessage}
        />

        {error && (
          <div className={styles.errorMessage}>
            <svg
              className={styles.errorIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <div className={styles.infoBox}>
          <h4>What we&apos;ll extract:</h4>
          <ul>
            <li>Expense name/description</li>
            <li>Total amount</li>
            <li>Currency (USD/EUR)</li>
            <li>Transaction date</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default UploadInvoiceModal;
