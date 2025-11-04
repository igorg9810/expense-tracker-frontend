import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'error' | 'success';

interface InputProps {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  defaultValue?: string;
  /** Current value (controlled) */
  value?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Whether the input has an error state */
  error?: boolean;
  /** Whether the input has a success state */
  success?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Error message to display below the input */
  errorMessage?: string;
  /** Success message to display below the input */
  successMessage?: string;
  /** Visual variant style */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Additional CSS class */
  className?: string;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
  /** Maximum length of input */
  maxLength?: number;
  /** Minimum length of input */
  minLength?: number;
  /** Pattern for validation */
  pattern?: string;
  /** Minimum value (for number inputs) */
  min?: number;
  /** Maximum value (for number inputs) */
  max?: number;
  /** Step value (for number inputs) */
  step?: number;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** ARIA invalid state */
  'aria-invalid'?: boolean;
  /** Custom data attributes */
  'data-testid'?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Key down handler */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Key up handler */
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Full width input */
  fullWidth?: boolean;
  /** Icon element to display before input */
  startIcon?: React.ReactNode;
  /** Icon element to display after input */
  endIcon?: React.ReactNode;
}

/**
 * A reusable Input component for form fields with validation and styling support.
 *
 * Provides consistent styling, validation states, and accessibility features for text inputs.
 * Supports different variants (default, error, success) and sizes with helper text.
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input />
 *
 * // Input with error state and helper text
 * <Input helperText="Error message" error />
 *
 * // Controlled input with validation
 * <Input
 *   type="text"
 *   placeholder="Enter name"
 *   defaultValue={name}
 *   error
 *   helperText="Error message"
 *   onChange={handleChange}
 * />
 *
 * // Input with success state
 * <Input
 *   value={email}
 *   success
 *   successMessage="Email is valid"
 *   onChange={handleEmailChange}
 * />
 *
 * // Input with icons
 * <Input
 *   startIcon={<SearchIcon />}
 *   endIcon={<ClearIcon />}
 *   placeholder="Search..."
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      defaultValue,
      value,
      disabled = false,
      readOnly = false,
      required = false,
      error = false,
      success = false,
      helperText,
      errorMessage,
      successMessage,
      variant = 'default',
      size = 'medium',
      className = '',
      name,
      id,
      maxLength,
      minLength,
      pattern,
      min,
      max,
      step,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'data-testid': dataTestId,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      fullWidth = false,
      startIcon,
      endIcon,
    },
    ref,
  ) => {
    // Determine the actual variant based on error/success states
    const actualVariant = error ? 'error' : success ? 'success' : variant;

    // Determine if input is invalid for ARIA
    const isInvalid = error || ariaInvalid === true;

    // Generate unique ID for helper text if not provided
    const helperId = React.useMemo(
      () => (id ? `${id}-helper` : `input-helper-${Math.random().toString(36).substr(2, 9)}`),
      [id],
    );

    const inputClasses = [
      styles.input,
      styles[actualVariant],
      styles[size],
      disabled && styles.disabled,
      readOnly && styles.readOnly,
      fullWidth && styles.fullWidth,
      startIcon && styles.withStartIcon,
      endIcon && styles.withEndIcon,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClasses = [styles.container, fullWidth && styles.fullWidth, className]
      .filter(Boolean)
      .join(' ');

    const renderHelperText = () => {
      if (error && errorMessage) {
        return (
          <span id={helperId} className={styles.helperText} role="alert" aria-live="polite">
            {errorMessage}
          </span>
        );
      }

      if (success && successMessage) {
        return (
          <span id={helperId} className={styles.successText}>
            {successMessage}
          </span>
        );
      }

      if (helperText) {
        return (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        );
      }

      return null;
    };

    return (
      <div className={containerClasses}>
        <div className={styles.inputWrapper}>
          {startIcon && (
            <span className={styles.startIcon} aria-hidden="true">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            id={id}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            min={min}
            max={max}
            step={step}
            className={inputClasses}
            aria-label={ariaLabel}
            aria-describedby={
              ariaDescribedBy ||
              (helperText || errorMessage || successMessage ? helperId : undefined)
            }
            aria-invalid={isInvalid}
            data-testid={dataTestId}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
          />
          {endIcon && (
            <span className={styles.endIcon} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </div>
        {renderHelperText()}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
