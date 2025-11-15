import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Success.module.css';

interface LocationState {
  type?: 'signup' | 'password-reset' | 'email-verification';
  email?: string;
  message?: string;
}

/**
 * Success Page Component
 *
 * Displays success messages for various authentication operations.
 * Adapts content based on the operation type passed via navigation state.
 */
const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Redirect to sign-in if no state is provided
  useEffect(() => {
    if (!state?.type) {
      navigate('/auth/sign-in', { replace: true });
    }
  }, [state, navigate]);

  const getSuccessContent = () => {
    switch (state?.type) {
      case 'password-reset':
        return {
          icon: '🔐',
          title: 'Password Reset Complete!',
          message: state.message || 'Your password has been successfully reset.',
          description: 'You can now sign in with your new password.',
          primaryAction: {
            text: 'Sign In Now',
            to: '/auth/sign-in',
          },
          secondaryAction: {
            text: 'Back to Home',
            to: '/',
          },
        };

      case 'email-verification':
        return {
          icon: '📧',
          title: 'Email Verified!',
          message: state.message || 'Your email has been successfully verified.',
          description: 'Your account is now fully activated and ready to use.',
          primaryAction: {
            text: 'Go to Dashboard',
            to: '/expense-table',
          },
          secondaryAction: {
            text: 'Sign In',
            to: '/auth/sign-in',
          },
        };

      case 'signup':
      default:
        return {
          icon: '🎉',
          title: 'Account Created Successfully!',
          message: state.message || 'Welcome to Expense Tracker!',
          description:
            'Your account has been created and you can now start tracking your expenses.',
          primaryAction: {
            text: 'Sign In Now',
            to: '/auth/sign-in',
          },
          secondaryAction: {
            text: 'Learn More',
            to: '/',
          },
        };
    }
  };

  const content = getSuccessContent();

  return (
    <div className={styles.authForm}>
      <div className={styles.successContainer}>
        <div className={styles.successIcon} role="img" aria-label="Success">
          {content.icon}
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.message}>{content.message}</p>
          {state?.email && (
            <p className={styles.email}>
              <strong>{state.email}</strong>
            </p>
          )}
          <p className={styles.description}>{content.description}</p>
        </div>

        <div className={styles.actions}>
          <Link to={content.primaryAction.to} className={styles.primaryButton}>
            {content.primaryAction.text}
          </Link>

          <div className={styles.secondaryActions}>
            <Link to={content.secondaryAction.to} className={styles.link}>
              {content.secondaryAction.text}
            </Link>
          </div>
        </div>

        {/* Additional helpful links for password reset */}
        {state?.type === 'password-reset' && (
          <div className={styles.additionalInfo}>
            <div className={styles.securityTips}>
              <h3 className={styles.tipsTitle}>Security Tips:</h3>
              <ul className={styles.tipsList}>
                <li>Use a unique password you haven&apos;t used before</li>
                <li>Consider using a password manager</li>
                <li>Keep your password confidential</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
