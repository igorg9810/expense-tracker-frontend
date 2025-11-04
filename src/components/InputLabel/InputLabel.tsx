import React from 'react';
import styles from './InputLabel.module.css';

export type InputLabelSize = 'small' | 'medium' | 'large';
export type InputLabelVariant = 'default' | 'required' | 'optional';

interface InputLabelProps {
  /** Label text or child content */
  children?: React.ReactNode;
  /** Associates the label with a form control */
  htmlFor?: string;
  /** Visual variant style */
  variant?: InputLabelVariant;
  /** Size of the label */
  size?: InputLabelSize;
  /** Additional CSS class */
  className?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** Custom data attributes */
  'data-testid'?: string;
}

/**
 * A reusable InputLabel component for form fields.
 *
 * Provides consistent styling and accessibility features for form labels.
 * Supports different variants (default, required, optional) and sizes.
 *
 * @example
 * ```tsx
 * // Basic label
 * <InputLabel>Name</InputLabel>
 *
 * // Label with htmlFor attribute
 * <InputLabel htmlFor="name1">Name</InputLabel>
 *
 * // Required field label
 * <InputLabel required variant="required">Email</InputLabel>
 *
 * // Optional field label
 * <InputLabel variant="optional">Phone Number</InputLabel>
 *
 * // Small size label
 * <InputLabel size="small">Username</InputLabel>
 *
 * // Disabled label
 * <InputLabel disabled>Disabled Field</InputLabel>
 * ```
 */
const InputLabel: React.FC<InputLabelProps> = ({
  children,
  htmlFor,
  variant = 'default',
  size = 'medium',
  className = '',
  required = false,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'data-testid': dataTestId,
}) => {
  const labelClasses = [
    styles.label,
    styles[variant],
    styles[size],
    required && styles.required,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderContent = () => {
    if (!children) return null;

    return (
      <>
        <span className={styles.text}>{children}</span>
        {required && variant === 'default' && (
          <span className={styles.requiredIndicator} aria-hidden="true">
            *
          </span>
        )}
        {variant === 'optional' && (
          <span className={styles.optionalIndicator} aria-hidden="true">
            (optional)
          </span>
        )}
      </>
    );
  };

  return (
    <label
      htmlFor={htmlFor}
      className={labelClasses}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={dataTestId}
    >
      {renderContent()}
    </label>
  );
};

export default InputLabel;
