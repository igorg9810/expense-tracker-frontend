import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../utils/hooks';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import UploadInvoiceModal from '../../components/UploadInvoiceModal';
import DraggableExpenseRow from '../../components/DraggableExpenseRow';
import type { InvoiceData, Expense } from '../../utils/api';
import { fetchExpenses, reorderExpenses } from '../../utils/api';
import { addSentryBreadcrumb, captureException } from '../../sentry';
import styles from './ExpenseTable.module.css';

/**
 * ExpenseTable Page Component
 *
 * Main page displaying user expenses in a table format with drag & drop reordering.
 * This is a protected component that shows user-specific data only.
 */
const ExpenseTable: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  /**
   * Load expenses from API
   */
  const loadExpenses = useCallback(async () => {
    try {
      setIsLoadingExpenses(true);
      setError(null);
      addSentryBreadcrumb('Loading expenses', { category: 'data', level: 'info' });
      const response = await fetchExpenses();
      setExpenses(response.data);
      addSentryBreadcrumb('Expenses loaded successfully', {
        category: 'data',
        level: 'info',
        data: { count: response.data.length },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load expenses';
      setError(errorMessage);
      console.error('Failed to load expenses:', err);
      captureException(err as Error, {
        context: { operation: 'loadExpenses' },
      });
    } finally {
      setIsLoadingExpenses(false);
    }
  }, []);

  /**
   * Fetch expenses on component mount
   */
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((index: number) => {
    setDragOverIndex(index);
  }, []);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  /**
   * Handle drop and reorder expenses
   */
  const handleDrop = useCallback(
    async (dropIndex: number) => {
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      try {
        setIsReordering(true);

        // Create new array with reordered items
        const newExpenses = [...expenses];
        const [draggedItem] = newExpenses.splice(draggedIndex, 1);
        newExpenses.splice(dropIndex, 0, draggedItem);

        // Optimistically update UI
        setExpenses(newExpenses);

        // Get the new order of IDs
        const newOrder = newExpenses.map((expense) => expense.id);

        addSentryBreadcrumb('Reordering expenses', {
          category: 'user-action',
          level: 'info',
          data: { from: draggedIndex, to: dropIndex, count: newOrder.length },
        });

        // Persist to backend
        await reorderExpenses(newOrder);

        console.log('Expenses reordered successfully');
        addSentryBreadcrumb('Expenses reordered successfully', {
          category: 'data',
          level: 'info',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reorder expenses';
        setError(errorMessage);
        console.error('Failed to reorder expenses:', err);
        captureException(err as Error, {
          context: {
            operation: 'reorderExpenses',
            from: draggedIndex,
            to: dropIndex,
          },
        });

        // Reload expenses to restore correct order
        await loadExpenses();
      } finally {
        setIsReordering(false);
        setDraggedIndex(null);
        setDragOverIndex(null);
      }
    },
    [draggedIndex, expenses, loadExpenses],
  );

  /**
   * Handle logout
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  /**
   * Handle invoice upload success
   * Pre-fill expense form with invoice data
   */
  const handleInvoiceSuccess = useCallback((data: InvoiceData) => {
    console.log('Invoice data received:', data);
    addSentryBreadcrumb('Invoice analyzed successfully', {
      category: 'user-action',
      level: 'info',
      data: { name: data.name, amount: data.amount, currency: data.currency },
    });
    setIsUploadModalOpen(false);

    // TODO: Open expense form and pre-fill with invoice data
    // This will be implemented when the expense form component is created
    alert(
      `Invoice analyzed!\nName: ${data.name}\nAmount: ${data.amount} ${data.currency || 'USD'}\nDate: ${data.date}`,
    );
  }, []);

  /**
   * Handle opening upload modal
   */
  const handleOpenUploadModal = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  /**
   * Handle closing upload modal
   */
  const handleCloseUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  return (
    <div className={styles.container}>
      <Logo href="/" />
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Expense Tracker</h1>
          <p className={styles.subtitle}>Track and manage your expenses</p>
        </div>
        <div className={styles.userSection}>
          <span className={styles.welcomeText}>Welcome, {user?.email || 'User'}!</span>
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={isLoading}
            className={styles.logoutButton}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>Your Personal Expenses</h2>
          <div className={styles.buttonGroup}>
            <Button
              variant="outlined"
              onClick={handleOpenUploadModal}
              className={styles.uploadButton}
            >
              📄 Upload Invoice
            </Button>
            <button className={styles.addButton}>Add Expense</button>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.errorIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
            <button className={styles.retryButton} onClick={loadExpenses}>
              Retry
            </button>
          </div>
        )}

        {isLoadingExpenses ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Loading your expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>📊</div>
            <h3>No Expenses Yet</h3>
            <p>
              Start tracking your expenses by adding your first expense or uploading an invoice.
            </p>
            <p className={styles.userInfo}>
              Logged in as: <strong>{user?.email}</strong>
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.dragColumn}></th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className={styles.actionsColumn}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <DraggableExpenseRow
                    key={expense.id}
                    expense={expense}
                    index={index}
                    isDragging={draggedIndex === index}
                    isOver={dragOverIndex === index}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                ))}
              </tbody>
            </table>
            {isReordering && (
              <div className={styles.reorderingOverlay}>
                <div className={styles.spinner} />
                <span>Saving order...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Invoice Modal */}
      <UploadInvoiceModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSuccess={handleInvoiceSuccess}
      />
    </div>
  );
};

export default ExpenseTable;
