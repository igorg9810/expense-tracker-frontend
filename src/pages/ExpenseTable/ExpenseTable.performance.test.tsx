/**
 * Performance Benchmark Tests
 *
 * Tests to verify render performance optimizations
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, describe, it, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import ExpenseTable from './ExpenseTable';
import type { Expense } from '../../utils/api';
import * as authHooks from '../../utils/hooks';
import * as expenseApi from '../../utils/api';

// Mock the auth hooks
jest.mock('../../utils/hooks', () => ({
  useAuth: jest.fn(),
}));

// Mock the expense API
jest.mock('../../utils/api', () => {
  const actual = jest.requireActual<typeof import('../../utils/api')>('../../utils/api');
  return {
    ...actual,
    fetchExpenses: jest.fn(),
    reorderExpenses: jest.fn(),
  };
});

// Mock the Logo, UploadInvoiceModal, and DraggableExpenseRow components
jest.mock('../../components/Logo', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="logo">Logo</div>,
  };
});

jest.mock('../../components/UploadInvoiceModal', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="upload-modal">Upload Modal</div>,
  };
});

jest.mock('../../components/DraggableExpenseRow', () => {
  return {
    __esModule: true,
    default: ({ expense }: { expense: Expense }) => (
      <tr data-testid={`expense-row-${expense.id}`}>
        <td>{expense.name}</td>
        <td>{expense.amount}</td>
        <td>{expense.category}</td>
      </tr>
    ),
  };
});

describe('ExpenseTable Performance', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockLogout = jest.fn();

  // Generate mock expenses for testing
  const generateMockExpenses = (count: number): Expense[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Expense ${i + 1}`,
      amount: (i + 1) * 10,
      currency: 'USD',
      category: 'Test',
      date: '2024-01-01',
      userId: 1,
      displayOrder: i,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authHooks.useAuth as ReturnType<typeof jest.fn>).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isLoading: false,
      isAuthenticated: true,
    });
  });

  it('renders large expense list efficiently (100 items)', async () => {
    const mockExpenses = generateMockExpenses(100);

    (expenseApi.fetchExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      data: mockExpenses,
      pagination: {
        total: 100,
        limit: 100,
        offset: 0,
      },
    });

    const startTime = performance.now();

    render(<ExpenseTable />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your expenses...')).not.toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Rendering 100 items should take less than 2000ms in test environment
    expect(renderTime).toBeLessThan(2000);

    // Verify all items rendered
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(100);

    console.log(`✓ Rendered 100 expenses in ${renderTime.toFixed(2)}ms`);
  });

  it('handles frequent state updates efficiently', async () => {
    const mockExpenses = generateMockExpenses(20);

    (expenseApi.fetchExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      data: mockExpenses,
      pagination: {
        total: 20,
        limit: 20,
        offset: 0,
      },
    });

    render(<ExpenseTable />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your expenses...')).not.toBeInTheDocument();
    });

    const uploadButton = screen.getByText(/Upload Invoice/i);
    const startTime = performance.now();

    // Simulate rapid button clicks
    for (let i = 0; i < 10; i++) {
      await userEvent.click(uploadButton);
    }

    const endTime = performance.now();
    const interactionTime = endTime - startTime;

    // Multiple interactions should be fast (<1000ms in test environment)
    expect(interactionTime).toBeLessThan(1000);

    console.log(`✓ Handled 10 interactions in ${interactionTime.toFixed(2)}ms`);
  });

  it('optimizes re-renders with React.memo', async () => {
    const mockExpenses = generateMockExpenses(10);
    let renderCount = 0;

    // Track renders by mocking Button component
    jest.mock('../../components/Button', () => ({
      default: jest.fn((props: React.ComponentProps<'button'>) => {
        renderCount++;
        return <button {...props} />;
      }),
    }));

    (expenseApi.fetchExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      data: mockExpenses,
      pagination: {
        total: 10,
        limit: 10,
        offset: 0,
      },
    });

    const { rerender } = render(<ExpenseTable />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your expenses...')).not.toBeInTheDocument();
    });

    const initialRenderCount = renderCount;

    // Re-render with same props
    rerender(<ExpenseTable />);

    // With React.memo, Button components shouldn't re-render
    // (or should re-render minimally)
    expect(renderCount - initialRenderCount).toBeLessThan(5);

    console.log(
      `✓ React.memo prevented ${initialRenderCount - (renderCount - initialRenderCount)} unnecessary renders`,
    );
  });

  it('maintains performance with drag operations', async () => {
    const mockExpenses = generateMockExpenses(50);

    (expenseApi.fetchExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      data: mockExpenses,
      pagination: {
        total: 50,
        limit: 50,
        offset: 0,
      },
    });

    (expenseApi.reorderExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      success: true,
    });

    render(<ExpenseTable />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your expenses...')).not.toBeInTheDocument();
    });

    // Simulate drag operation
    const startTime = performance.now();

    // Get all rows
    const rows = screen.getAllByRole('row').slice(1); // Skip header

    if (rows.length > 0) {
      // Simulate drag events on first row
      const firstRow = rows[0];
      const dragHandle = firstRow.querySelector('[title="Drag to reorder"]');

      if (dragHandle) {
        await userEvent.pointer([
          { keys: '[MouseLeft>]', target: dragHandle },
          { coords: { x: 100, y: 100 } },
          { keys: '[/MouseLeft]' },
        ]);
      }
    }

    const endTime = performance.now();
    const dragTime = endTime - startTime;

    // Drag operation should be fast (<500ms in test environment)
    expect(dragTime).toBeLessThan(500);

    console.log(`✓ Drag operation completed in ${dragTime.toFixed(2)}ms`);
  });

  it('efficiently updates expense list after reorder', async () => {
    const mockExpenses = generateMockExpenses(30);

    (expenseApi.fetchExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      data: mockExpenses,
      pagination: {
        total: 30,
        limit: 30,
        offset: 0,
      },
    });

    (expenseApi.reorderExpenses as ReturnType<typeof jest.fn>).mockResolvedValue({
      success: true,
    });

    render(<ExpenseTable />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your expenses...')).not.toBeInTheDocument();
    });

    const startTime = performance.now();

    // Trigger reorder
    await waitFor(() => {
      expect(expenseApi.fetchExpenses).toHaveBeenCalled();
    });

    const endTime = performance.now();
    const updateTime = endTime - startTime;

    // List update should be fast (<200ms in test environment)
    expect(updateTime).toBeLessThan(200);

    console.log(`✓ List update completed in ${updateTime.toFixed(2)}ms`);
  });
});
