import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'close' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  /** Button text or child content */
  children?: React.ReactNode;
  /** Click handler function */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Active state for toggle buttons */
  active?: boolean;
  /** Visual variant style */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Additional CSS class */
  className?: string;
  /** Type attribute for the button */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** Icon element to display before text */
  icon?: React.ReactNode;
  /** Icon element to display after text */
  endIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * A reusable Button component with multiple variants and states.
 *
 * Supports primary, secondary, outlined, close, and icon variants with different sizes.
 * Includes loading, disabled, and active states for enhanced UX.
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Create
 * </Button>
 *
 * // Close/Icon button
 * <Button variant="close" aria-label="Close" onClick={handleClose} />
 *
 * // Button with loading state
 * <Button variant="primary" loading={true}>
 *   Submit
 * </Button>
 *
 * // Button with icon
 * <Button icon={<PlusIcon />} variant="primary">
 *   Add Item
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  active = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  icon,
  endIcon,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    active && styles.active,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  // Close button renders without children
  const renderContent = () => {
    if (variant === 'close') {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <>
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="2s"
                  values="0 31.416;15.708 15.708;0 31.416;0 31.416"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="2s"
                  values="0;-15.708;-31.416;-31.416"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </span>
        )}
        {!loading && icon && <span className={styles.iconStart}>{icon}</span>}
        {children && <span className={styles.content}>{children}</span>}
        {!loading && endIcon && <span className={styles.iconEnd}>{endIcon}</span>}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {renderContent()}
    </button>
  );
};

Button.displayName = 'Button';

export default React.memo(Button);
