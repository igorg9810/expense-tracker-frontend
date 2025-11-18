import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchExpenses, reorderExpenses, validateExpenseOrder } from './expenseService';
import type { Expense, ExpensesResponse, ReorderExpensesResponse } from './expenseService';
import { apiClient } from '../auth/apiClient';

// Mock the apiClient
vi.mock('../auth/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('expenseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fetchExpenses();

      expect(apiClient.get).toHaveBeenCalledWith('/expenses', {
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

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockResponse,
      });

      await fetchExpenses(mockParams);

      expect(apiClient.get).toHaveBeenCalledWith('/expenses', {
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

      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(fetchExpenses()).rejects.toThrow(
        'Failed to fetch expenses: Failed to fetch expenses',
      );
    });

    it('should handle API errors without response data', async () => {
      const mockError = new Error('Network error');

      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(fetchExpenses()).rejects.toThrow('Failed to fetch expenses: Network error');
    });

    it('should handle unknown errors', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue('Unknown error');

      await expect(fetchExpenses()).rejects.toThrow(
        'Failed to fetch expenses: An unknown error occurred',
      );
    });
  });

  describe('reorderExpenses', () => {
    it('should reorder expenses successfully', async () => {
      const order = [3, 1, 2];
      const mockResponse: ReorderExpensesResponse = {
        success: true,
      };

      (apiClient.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockResponse,
      });

      const result = await reorderExpenses(order);

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/expenses/reorder',
        { order },
        { timeout: 10000 },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should validate order before making API call', async () => {
      const invalidOrder = [1, -2, 3];

      await expect(reorderExpenses(invalidOrder)).rejects.toThrow(
        'Order must be an array of positive integers',
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

      (apiClient.patch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(reorderExpenses(order)).rejects.toThrow(
        'Failed to reorder expenses: Invalid expense order',
      );
    });

    it('should handle API errors without response data', async () => {
      const order = [1, 2, 3];
      const mockError = new Error('Network error');

      (apiClient.patch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(reorderExpenses(order)).rejects.toThrow(
        'Failed to reorder expenses: Network error',
      );
    });

    it('should handle unknown errors', async () => {
      const order = [1, 2, 3];

      (apiClient.patch as ReturnType<typeof vi.fn>).mockRejectedValue('Unknown error');

      await expect(reorderExpenses(order)).rejects.toThrow(
        'Failed to reorder expenses: An unknown error occurred',
      );
    });
  });

  describe('validateExpenseOrder', () => {
    it('should return true for valid order array', () => {
      expect(validateExpenseOrder([1, 2, 3])).toBe(true);
      expect(validateExpenseOrder([5, 1, 3, 2, 4])).toBe(true);
      expect(validateExpenseOrder([100])).toBe(true);
    });

    it('should throw error if order is not an array', () => {
      expect(() => validateExpenseOrder(null as unknown as number[])).toThrow(
        'Order must be an array',
      );
      expect(() => validateExpenseOrder(undefined as unknown as number[])).toThrow(
        'Order must be an array',
      );
      expect(() => validateExpenseOrder({} as unknown as number[])).toThrow(
        'Order must be an array',
      );
      expect(() => validateExpenseOrder(123 as unknown as number[])).toThrow(
        'Order must be an array',
      );
    });

    it('should throw error if order array is empty', () => {
      expect(() => validateExpenseOrder([])).toThrow('Order array cannot be empty');
    });

    it('should throw error if order contains non-positive numbers', () => {
      expect(() => validateExpenseOrder([1, 0, 3])).toThrow(
        'Order must be an array of positive integers',
      );
      expect(() => validateExpenseOrder([1, -2, 3])).toThrow(
        'Order must be an array of positive integers',
      );
      expect(() => validateExpenseOrder([-1])).toThrow(
        'Order must be an array of positive integers',
      );
    });

    it('should throw error if order contains non-integers', () => {
      expect(() => validateExpenseOrder([1, 2.5, 3])).toThrow(
        'Order must be an array of positive integers',
      );
      expect(() => validateExpenseOrder([1, 2, 3.14])).toThrow(
        'Order must be an array of positive integers',
      );
    });

    it('should throw error if order contains duplicate values', () => {
      expect(() => validateExpenseOrder([1, 2, 2, 3])).toThrow(
        'Order array cannot contain duplicate values',
      );
      expect(() => validateExpenseOrder([5, 3, 5])).toThrow(
        'Order array cannot contain duplicate values',
      );
      expect(() => validateExpenseOrder([1, 1])).toThrow(
        'Order array cannot contain duplicate values',
      );
    });

    it('should throw error if order contains non-number values', () => {
      expect(() => validateExpenseOrder([1, '2' as unknown as number, 3])).toThrow(
        'Order must be an array of positive integers',
      );
      expect(() => validateExpenseOrder([1, null as unknown as number, 3])).toThrow(
        'Order must be an array of positive integers',
      );
      expect(() => validateExpenseOrder([1, undefined as unknown as number, 3])).toThrow(
        'Order must be an array of positive integers',
      );
    });
  });
});
