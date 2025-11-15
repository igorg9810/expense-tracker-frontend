import React, { useState, forwardRef } from 'react';
import Icon from '../Icon';
import styles from './PasswordInput.module.css';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  successMessage?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, success, successMessage, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success && !hasError);

    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputWrapper}>
          <input
            {...props}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`${styles.input} ${hasError ? styles.error : ''} ${
              hasSuccess ? styles.success : ''
            } ${props.disabled ? styles.disabled : ''}`}
            autoComplete="current-password"
          />

          <button
            type="button"
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <Icon
              iconName={showPassword ? 'close' : 'edit'}
              size="small"
              color={hasError ? 'error' : 'default'}
            />
          </button>
        </div>

        {/* Error message */}
        {hasError && (
          <div className={styles.errorMessage} role="alert">
            <Icon iconName="close" size="small" color="error" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {hasSuccess && successMessage && (
          <div className={styles.successMessage}>
            <Icon iconName="plus" size="small" color="success" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Helper text */}
        {!hasError && !hasSuccess && helperText && (
          <div className={styles.helperText}>{helperText}</div>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
