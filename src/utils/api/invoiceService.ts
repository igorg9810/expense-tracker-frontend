/**
 * Invoice API Service
 *
 * Handles invoice upload and analysis functionality
 */

import { apiClient } from '../auth/apiClient';

export interface InvoiceData {
  name: string;
  amount: number;
  currency?: 'USD' | 'EUR';
  date: string;
}

export interface InvoiceErrorResponse {
  error: string;
  details?: string;
}

/**
 * Upload invoice image for analysis
 *
 * @param file - JPG image file (max 5MB)
 * @returns Extracted invoice data
 * @throws Error if upload fails or file is invalid
 */
export const uploadInvoice = async (file: File): Promise<InvoiceData> => {
  try {
    // Create FormData to send file
    const formData = new FormData();
    formData.append('invoice', file);

    // Send request
    // Backend returns InvoiceData directly: { name, amount, currency, date }
    const response = await apiClient.post<InvoiceData>('/api/invoices/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase timeout for file upload
      timeout: 30000, // 30 seconds
    });

    // Validate response has required fields
    if (!response.data || !response.data.name || !response.data.amount) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    // Handle different error types
    if (error instanceof Error) {
      throw error;
    }

    // Handle axios errors with backend error format
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: InvoiceErrorResponse | { message?: string };
        };
      };

      const errorData = axiosError.response?.data;

      // Backend returns { error, details? } for errors
      if (errorData && 'error' in errorData) {
        const message = errorData.details || errorData.error || 'Failed to analyze invoice';
        throw new Error(message);
      }

      // Fallback for other error formats
      const message =
        errorData && 'message' in errorData ? errorData.message : 'Failed to upload invoice';
      throw new Error(message || 'Failed to upload invoice');
    }

    throw new Error('An unexpected error occurred while uploading the invoice');
  }
};

/**
 * Validate invoice file before upload
 *
 * @param file - File to validate
 * @returns Validation error message or null if valid
 */
export const validateInvoiceFile = (file: File): string | null => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return 'Only JPG/JPEG files are allowed';
  }

  // Check file size
  if (file.size > MAX_SIZE) {
    return 'File size must be less than 5MB';
  }

  // Check if file is empty
  if (file.size === 0) {
    return 'File is empty';
  }

  return null;
};
