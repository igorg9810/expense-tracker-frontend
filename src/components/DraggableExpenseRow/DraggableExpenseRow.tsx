import React from 'react';
import type { DragEvent } from 'react';
import type { Expense } from '../../utils/api';
import styles from './DraggableExpenseRow.module.css';

export interface DraggableExpenseRowProps {
  /** Expense data to display */
  expense: Expense;
  /** Index of the expense in the list */
  index: number;
  /** Whether the row is currently being dragged */
  isDragging: boolean;
  /** Whether the row is a drop target */
  isOver: boolean;
  /** Callback when drag starts */
  onDragStart: (index: number) => void;
  /** Callback when drag ends */
  onDragEnd: () => void;
  /** Callback when dragging over this row */
  onDragOver: (index: number) => void;
  /** Callback when leaving this row */
  onDragLeave: () => void;
  /** Callback when dropped on this row */
  onDrop: (index: number) => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * DraggableExpenseRow Component
 *
 * A table row component that can be dragged and dropped to reorder expenses.
 * Uses HTML5 Drag and Drop API for native browser support.
 */
const DraggableExpenseRow: React.FC<DraggableExpenseRowProps> = ({
  expense,
  index,
  isDragging,
  isOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  className = '',
}) => {
  /**
   * Handle drag start event
   */
  const handleDragStart = (e: DragEvent<HTMLTableRowElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.dataTransfer.setData('text/plain', index.toString());
    onDragStart(index);
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(index);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(index);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = () => {
    onDragLeave();
  };

  /**
   * Handle drag end event
   */
  const handleDragEnd = () => {
    onDragEnd();
  };

  /**
   * Format currency display
   */
  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  /**
   * Format date display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const rowClassName = [
    styles.row,
    isDragging && styles.dragging,
    isOver && styles.dragOver,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr
      className={rowClassName}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`expense-row-${expense.id}`}
    >
      <td className={styles.dragHandle}>
        <div className={styles.handleIcon} title="Drag to reorder">
          ⋮⋮
        </div>
      </td>
      <td className={styles.cell}>{expense.name}</td>
      <td className={styles.cell}>{formatCurrency(expense.amount, expense.currency)}</td>
      <td className={styles.cell}>{expense.category}</td>
      <td className={styles.cell}>{formatDate(expense.date)}</td>
      <td className={styles.actions}>
        <button className={styles.actionButton} title="Edit expense">
          ✏️
        </button>
        <button className={styles.actionButton} title="Delete expense">
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default DraggableExpenseRow;
