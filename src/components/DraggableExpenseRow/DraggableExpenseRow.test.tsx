import { describe, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DraggableExpenseRow from './DraggableExpenseRow';
import type { Expense } from '../../utils/api/expenseService';

describe('DraggableExpenseRow', () => {
  const mockExpense: Expense = {
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
  };

  const mockHandlers = {
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    onDragOver: jest.fn(),
    onDragLeave: jest.fn(),
    onDrop: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render expense data correctly', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    expect(screen.getByText('Office Supplies')).toBeInTheDocument();
    expect(screen.getByText('$150.50')).toBeInTheDocument();
    expect(screen.getByText('Office')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('should display drag handle', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const dragHandle = screen.getByTitle('Drag to reorder');
    expect(dragHandle).toBeInTheDocument();
    expect(dragHandle).toHaveTextContent('⋮⋮');
  });

  it('should display action buttons', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    expect(screen.getByTitle('Edit expense')).toBeInTheDocument();
    expect(screen.getByTitle('Delete expense')).toBeInTheDocument();
  });

  it('should apply dragging class when isDragging is true', () => {
    const { container } = render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={true}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('dragging');
  });

  it('should apply dragOver class when isOver is true', () => {
    const { container } = render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={true}
        {...mockHandlers}
      />,
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('dragOver');
  });

  it('should apply custom className if provided', () => {
    const { container } = render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        className="custom-class"
        {...mockHandlers}
      />,
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('custom-class');
  });

  it('should call onDragStart when drag starts', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = screen.getByTestId('expense-row-1');
    const dataTransfer = {
      effectAllowed: '',
      setData: jest.fn(),
    };
    fireEvent.dragStart(row, { dataTransfer });

    expect(mockHandlers.onDragStart).toHaveBeenCalledWith(0);
  });

  it('should call onDragEnd when drag ends', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = screen.getByTestId('expense-row-1');
    row.dispatchEvent(new Event('dragend', { bubbles: true }));

    expect(mockHandlers.onDragEnd).toHaveBeenCalled();
  });

  it('should call onDragOver when dragged over', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = screen.getByTestId('expense-row-1');
    const dataTransfer = {
      dropEffect: '',
    };
    fireEvent.dragOver(row, { dataTransfer });

    expect(mockHandlers.onDragOver).toHaveBeenCalledWith(0);
  });

  it('should call onDragLeave when drag leaves', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = screen.getByTestId('expense-row-1');
    row.dispatchEvent(new Event('dragleave', { bubbles: true }));

    expect(mockHandlers.onDragLeave).toHaveBeenCalled();
  });

  it('should call onDrop when dropped', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = screen.getByTestId('expense-row-1');
    row.dispatchEvent(new Event('drop', { bubbles: true }));

    expect(mockHandlers.onDrop).toHaveBeenCalledWith(0);
  });

  it('should format currency correctly for USD', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    expect(screen.getByText('$150.50')).toBeInTheDocument();
  });

  it('should format currency correctly for EUR', () => {
    const euroExpense: Expense = {
      ...mockExpense,
      currency: 'EUR',
      amount: 200.75,
    };

    render(
      <DraggableExpenseRow
        expense={euroExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    expect(screen.getByText('€200.75')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    // Date should be formatted as M/D/YYYY
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('should handle long expense names', () => {
    const longNameExpense: Expense = {
      ...mockExpense,
      name: 'Very Long Expense Name That Should Be Displayed Completely',
    };

    render(
      <DraggableExpenseRow
        expense={longNameExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    expect(
      screen.getByText('Very Long Expense Name That Should Be Displayed Completely'),
    ).toBeInTheDocument();
  });

  it('should handle large amounts', () => {
    const largeAmountExpense: Expense = {
      ...mockExpense,
      amount: 1234567.89,
    };

    render(
      <DraggableExpenseRow
        expense={largeAmountExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <DraggableExpenseRow
        expense={mockExpense}
        index={0}
        isDragging={false}
        isOver={false}
        {...mockHandlers}
      />,
    );

    const row = screen.getByTestId('expense-row-1');
    expect(row).toHaveAttribute('draggable', 'true');
  });

  it('should render multiple expenses with different indices', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <DraggableExpenseRow
            expense={mockExpense}
            index={0}
            isDragging={false}
            isOver={false}
            {...mockHandlers}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByTestId('expense-row-1')).toBeInTheDocument();

    rerender(
      <table>
        <tbody>
          <DraggableExpenseRow
            expense={{ ...mockExpense, id: 2 }}
            index={1}
            isDragging={false}
            isOver={false}
            {...mockHandlers}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByTestId('expense-row-2')).toBeInTheDocument();
  });
});
