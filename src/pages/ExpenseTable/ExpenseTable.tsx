import React from 'react';
import { useAuth } from '../../utils/hooks';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import styles from './ExpenseTable.module.css';

/**
 * ExpenseTable Page Component
 *
 * Main page displaying user expenses in a table format.
 * This is a protected component that shows user-specific data only.
 */
const ExpenseTable: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
          <button className={styles.addButton}>Add Expense</button>
        </div>

        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>📊</div>
          <h3>Your Personal Expense Table</h3>
          <p>This is where your personal expenses will be displayed.</p>
          <p className={styles.userInfo}>
            Logged in as: <strong>{user?.email}</strong>
          </p>
          <p>Protected features available:</p>
          <ul className={styles.featureList}>
            <li>View only your expenses</li>
            <li>Filter and sort your data</li>
            <li>Add new expenses to your account</li>
            <li>Edit your existing expenses</li>
            <li>Delete your expenses</li>
            <li>Secure data isolation from other users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
