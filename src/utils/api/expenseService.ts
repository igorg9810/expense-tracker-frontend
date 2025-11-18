/**
 * Expense API Service
 *
 * Handles expense CRUD operations and reordering functionality
 */

import { apiClient } from '../auth/apiClient';

export interface Expense {
  id: number;
  name: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  userId: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesResponse {
  data: Expense[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ReorderExpensesRequest {
  order: number[];
}

export interface ReorderExpensesResponse {
  success: boolean;
}

/**
 * Fetch all expenses for the authenticated user
 *
 * @param params - Optional query parameters for filtering
 * @returns List of expenses with pagination
 */
export const fetchExpenses = async (params?: {
  category?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}): Promise<ExpensesResponse> => {
  try {
    const response = await apiClient.get<ExpensesResponse>('/api/expenses', {
      params,
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to fetch expenses';
      throw new Error(message);
    }

    throw new Error('An unexpected error occurred while fetching expenses');
  }
};

/**
 * Reorder expenses by providing an array of expense IDs in the desired order
 *
 * @param order - Array of expense IDs in the desired display order
 * @returns Success response
 * @throws Error if reorder fails
 */
export const reorderExpenses = async (order: number[]): Promise<ReorderExpensesResponse> => {
  try {
    // Validate input
    if (!Array.isArray(order) || order.length === 0) {
      throw new Error('Order array must be a non-empty array of expense IDs');
    }

    // Validate all IDs are positive integers
    for (const id of order) {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('All expense IDs must be positive integers');
      }
    }

    const response = await apiClient.patch<ReorderExpensesResponse>(
      '/api/expenses/reorder',
      { order },
      {
        timeout: 10000, // 10 seconds
      },
    );

    if (!response.data || !response.data.success) {
      throw new Error('Reorder operation failed');
    }

    return response.data;
  } catch (error) {
    // Handle different error types
    if (error instanceof Error) {
      throw error;
    }

    // Handle axios errors
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const errorData = axiosError.response?.data;
      const message = errorData?.message || errorData?.error || 'Failed to reorder expenses';
      throw new Error(message);
    }

    throw new Error('An unexpected error occurred while reordering expenses');
  }
};

/**
 * Validate expense order array
 *
 * @param order - Array of expense IDs to validate
 * @returns Validation error message or null if valid
 */
export const validateExpenseOrder = (order: number[]): string | null => {
  if (!Array.isArray(order)) {
    return 'Order must be an array';
  }

  if (order.length === 0) {
    return 'Order array cannot be empty';
  }

  for (const id of order) {
    if (!Number.isInteger(id) || id <= 0) {
      return 'All expense IDs must be positive integers';
    }
  }

  // Check for duplicates
  const uniqueIds = new Set(order);
  if (uniqueIds.size !== order.length) {
    return 'Order array contains duplicate IDs';
  }

  return null;
};
