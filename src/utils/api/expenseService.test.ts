import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { fetchExpenses, reorderExpenses, validateExpenseOrder } from './expenseService';
import type { Expense, ExpensesResponse, ReorderExpensesResponse } from './expenseService';
import { apiClient } from '../auth/apiClient';

// Mock the apiClient
jest.mock('../auth/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('expenseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchExpenses', () => {
    it('should fetch expenses successfully', async () => {
      const mockExpenses: Expense[] = [
        {
          id: 1,
          name: 'Office Supplies',
          amount: 150.5,
          currency: 'USD',
          category: 'Office',
          date: '2024-01-15',
          userId: 1,
          displayOrder: 0,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          name: 'Team Lunch',
          amount: 250.0,
          currency: 'USD',
          category: 'Food',
          date: '2024-01-16',
          userId: 1,
          displayOrder: 1,
          createdAt: '2024-01-16T12:00:00Z',
          updatedAt: '2024-01-16T12:00:00Z',
        },
      ];

      const mockResponse: ExpensesResponse = {
        data: mockExpenses,
        pagination: {
          total: 2,
          limit: 10,
          offset: 0,
        },
      };

      (apiClient.get as ReturnType<typeof jest.fn>).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fetchExpenses();

      expect(apiClient.get).toHaveBeenCalledWith('/api/expenses', {
        params: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch expenses with query parameters', async () => {
      const mockParams = {
        category: 'Office',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockResponse: ExpensesResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 10,
          offset: 0,
        },
      };

      (apiClient.get as ReturnType<typeof jest.fn>).mockResolvedValue({
        data: mockResponse,
      });

      await fetchExpenses(mockParams);

      expect(apiClient.get).toHaveBeenCalledWith('/api/expenses', {
        params: mockParams,
      });
    });

    it('should handle API errors with error response', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Failed to fetch expenses',
          },
        },
      };

      (apiClient.get as ReturnType<typeof jest.fn>).mockRejectedValue(mockError);

      await expect(fetchExpenses()).rejects.toThrow('Failed to fetch expenses');
    });

    it('should handle API errors without response data', async () => {
      const mockError = new Error('Network error');

      (apiClient.get as ReturnType<typeof jest.fn>).mockRejectedValue(mockError);

      await expect(fetchExpenses()).rejects.toThrow('Network error');
    });

    it('should handle unknown errors', async () => {
      (apiClient.get as ReturnType<typeof jest.fn>).mockRejectedValue('Unknown error');

      await expect(fetchExpenses()).rejects.toThrow(
        'An unexpected error occurred while fetching expenses',
      );
    });
  });

  describe('reorderExpenses', () => {
    it('should reorder expenses successfully', async () => {
      const order = [3, 1, 2];
      const mockResponse: ReorderExpensesResponse = {
        success: true,
      };

      (apiClient.patch as ReturnType<typeof jest.fn>).mockResolvedValue({
        data: mockResponse,
      });

      const result = await reorderExpenses(order);

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/api/expenses/reorder',
        { order },
        {
          timeout: 10000,
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should validate order before making API call', async () => {
      const invalidOrder = [1, -2, 3];

      await expect(reorderExpenses(invalidOrder)).rejects.toThrow(
        'All expense IDs must be positive integers',
      );

      expect(apiClient.patch).not.toHaveBeenCalled();
    });

    it('should handle API errors with error response', async () => {
      const order = [1, 2, 3];
      const mockError = {
        response: {
          data: {
            message: 'Invalid expense order',
          },
        },
      };

      (apiClient.patch as ReturnType<typeof jest.fn>).mockRejectedValue(mockError);

      await expect(reorderExpenses(order)).rejects.toThrow('Invalid expense order');
    });

    it('should handle API errors without response data', async () => {
      const order = [1, 2, 3];
      const mockError = new Error('Network error');

      (apiClient.patch as ReturnType<typeof jest.fn>).mockRejectedValue(mockError);

      await expect(reorderExpenses(order)).rejects.toThrow('Network error');
    });

    it('should handle unknown errors', async () => {
      const order = [1, 2, 3];

      (apiClient.patch as ReturnType<typeof jest.fn>).mockRejectedValue('Unknown error');

      await expect(reorderExpenses(order)).rejects.toThrow(
        'An unexpected error occurred while reordering expenses',
      );
    });
  });

  describe('validateExpenseOrder', () => {
    it('should return null for valid order array', () => {
      expect(validateExpenseOrder([1, 2, 3])).toBeNull();
      expect(validateExpenseOrder([5, 1, 3, 2, 4])).toBeNull();
      expect(validateExpenseOrder([100])).toBeNull();
    });

    it('should return error message if order is not an array', () => {
      expect(validateExpenseOrder(null as unknown as number[])).toBe('Order must be an array');
      expect(validateExpenseOrder(undefined as unknown as number[])).toBe('Order must be an array');
      expect(validateExpenseOrder({} as unknown as number[])).toBe('Order must be an array');
      expect(validateExpenseOrder(123 as unknown as number[])).toBe('Order must be an array');
    });

    it('should return error message if order array is empty', () => {
      expect(validateExpenseOrder([])).toBe('Order array cannot be empty');
    });

    it('should return error message if order contains non-positive numbers', () => {
      expect(validateExpenseOrder([1, 0, 3])).toBe('All expense IDs must be positive integers');
      expect(validateExpenseOrder([1, -2, 3])).toBe('All expense IDs must be positive integers');
      expect(validateExpenseOrder([-1])).toBe('All expense IDs must be positive integers');
    });

    it('should return error message if order contains non-integers', () => {
      expect(validateExpenseOrder([1, 2.5, 3])).toBe('All expense IDs must be positive integers');
      expect(validateExpenseOrder([1, 2, 3.14])).toBe('All expense IDs must be positive integers');
    });

    it('should return error message if order contains duplicate values', () => {
      expect(validateExpenseOrder([1, 2, 2, 3])).toBe('Order array contains duplicate IDs');
      expect(validateExpenseOrder([5, 3, 5])).toBe('Order array contains duplicate IDs');
      expect(validateExpenseOrder([1, 1])).toBe('Order array contains duplicate IDs');
    });

    it('should return error message if order contains non-number values', () => {
      expect(validateExpenseOrder([1, '2' as unknown as number, 3])).toBe(
        'All expense IDs must be positive integers',
      );
      expect(validateExpenseOrder([1, null as unknown as number, 3])).toBe(
        'All expense IDs must be positive integers',
      );
      expect(validateExpenseOrder([1, undefined as unknown as number, 3])).toBe(
        'All expense IDs must be positive integers',
      );
    });
  });
});
