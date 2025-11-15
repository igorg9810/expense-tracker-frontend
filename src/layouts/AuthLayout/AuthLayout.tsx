import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Background with gradient or pattern */}
      <div className={styles.background}>
        <div className={styles.backgroundPattern}></div>
      </div>

      {/* Main content area */}
      <div className={styles.content}>
        {/* Left side - Branding/Info (hidden on mobile) */}
        <div className={styles.brandingSection}>
          <div className={styles.brandingContent}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>💰</div>
              <h1 className={styles.logoText}>ExpenseTracker</h1>
            </div>

            <div className={styles.heroText}>
              <h2 className={styles.heroTitle}>Take control of your finances</h2>
              <p className={styles.heroDescription}>
                Track expenses, set budgets, and achieve your financial goals with our easy-to-use
                expense tracking application.
              </p>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <span className={styles.featureText}>Detailed Analytics</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔒</span>
                <span className={styles.featureText}>Secure & Private</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📱</span>
                <span className={styles.featureText}>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Authentication Form */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            {/* Mobile logo (visible only on small screens) */}
            <div className={styles.mobileLogo}>
              <div className={styles.mobileLogoIcon}>💰</div>
              <span className={styles.mobileLogoText}>ExpenseTracker</span>
            </div>

            {/* Form content */}
            <div className={styles.formContent}>{children || <Outlet />}</div>

            {/* Footer */}
            <div className={styles.footer}>
              <p className={styles.footerText}>© 2024 ExpenseTracker. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
