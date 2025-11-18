import { uploadInvoice, validateInvoiceFile } from './invoiceService';
import { apiClient } from '../auth/apiClient';

// Mock the apiClient
jest.mock('../auth/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('Invoice Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateInvoiceFile', () => {
    it('returns null for valid JPG file', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const error = validateInvoiceFile(file);
      expect(error).toBeNull();
    });

    it('returns null for valid JPEG file', () => {
      const file = new File(['content'], 'test.jpeg', { type: 'image/jpeg' });
      const error = validateInvoiceFile(file);
      expect(error).toBeNull();
    });

    it('returns error for non-JPG file', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const error = validateInvoiceFile(file);
      expect(error).toBe('Only JPG/JPEG files are allowed');
    });

    it('returns error for file exceeding 5MB', () => {
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const error = validateInvoiceFile(file);
      expect(error).toBe('File size must be less than 5MB');
    });

    it('returns error for empty file', () => {
      const file = new File([], 'empty.jpg', { type: 'image/jpeg' });
      const error = validateInvoiceFile(file);
      expect(error).toBe('File is empty');
    });

    it('is case-insensitive for file type', () => {
      const file = new File(['content'], 'test.JPG', { type: 'image/JPEG' });
      const error = validateInvoiceFile(file);
      expect(error).toBeNull();
    });
  });

  describe('uploadInvoice', () => {
    const mockInvoiceData = {
      name: 'Grocery Shopping',
      amount: 150.75,
      currency: 'USD' as const,
      date: '2025-01-15',
    };

    it('successfully uploads invoice and returns data', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      // Backend returns data directly without wrapping
      const mockResponse = {
        data: mockInvoiceData,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await uploadInvoice(file);

      expect(result).toEqual(mockInvoiceData);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/invoices/analyze',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }),
      );
    });

    it('sends file as FormData with correct field name', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        data: mockInvoiceData,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await uploadInvoice(file);

      const callArgs = (apiClient.post as jest.Mock).mock.calls[0];
      const formData = callArgs[1] as FormData;

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('invoice')).toBe(file);
    });

    it('throws error when response data is missing required fields', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        data: {
          name: 'Test',
          // Missing amount
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await expect(uploadInvoice(file)).rejects.toThrow('Invalid response from server');
    });

    it('throws error when response data is empty', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockResponse = {};

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await expect(uploadInvoice(file)).rejects.toThrow('Invalid response from server');
    });

    it('handles backend error response format', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockError = {
        response: {
          data: {
            error: 'Could not parse the invoice image',
            details: 'No text could be extracted from the image',
          },
        },
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(uploadInvoice(file)).rejects.toThrow(
        'No text could be extracted from the image',
      );
    });

    it('handles backend error response without details', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockError = {
        response: {
          data: {
            error: 'Invalid file format or size',
          },
        },
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(uploadInvoice(file)).rejects.toThrow('Invalid file format or size');
    });

    it('handles generic axios errors with message', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockError = {
        response: {
          data: {
            message: 'Image quality too low',
          },
        },
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(uploadInvoice(file)).rejects.toThrow('Image quality too low');
    });

    it('handles generic axios errors without message', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockError = {
        response: {
          data: {},
        },
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(uploadInvoice(file)).rejects.toThrow('Failed to upload invoice');
    });

    it('handles network errors', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockError = new Error('Network error');

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(uploadInvoice(file)).rejects.toThrow('Network error');
    });

    it('handles unknown errors', async () => {
      const file = new File(['content'], 'invoice.jpg', { type: 'image/jpeg' });
      const mockError = 'Unknown error';

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(uploadInvoice(file)).rejects.toThrow(
        'An unexpected error occurred while uploading the invoice',
      );
    });
  });
});
