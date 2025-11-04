import React, { forwardRef } from 'react';
import styles from './DatePicker.module.css';

export type DatePickerSize = 'small' | 'medium' | 'large';
export type DatePickerVariant = 'default' | 'error' | 'success';

interface DatePickerProps {
  /** Current value (controlled) - ISO date string (YYYY-MM-DD) */
  value?: string;
  /** Default value - ISO date string (YYYY-MM-DD) */
  defaultValue?: string;
  /** Whether the date picker is disabled */
  disabled?: boolean;
  /** Whether the date picker is read-only */
  readOnly?: boolean;
  /** Whether the date picker is required */
  required?: boolean;
  /** Whether the date picker has an error state */
  error?: boolean;
  /** Whether the date picker has a success state */
  success?: boolean;
  /** Helper text to display below the date picker */
  helperText?: string;
  /** Error message to display below the date picker */
  errorMessage?: string;
  /** Success message to display below the date picker */
  successMessage?: string;
  /** Visual variant style */
  variant?: DatePickerVariant;
  /** Size of the date picker */
  size?: DatePickerSize;
  /** Additional CSS class */
  className?: string;
  /** Date picker name attribute */
  name?: string;
  /** Date picker id attribute */
  id?: string;
  /** Minimum date - ISO date string (YYYY-MM-DD) */
  min?: string;
  /** Maximum date - ISO date string (YYYY-MM-DD) */
  max?: string;
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
  /** Full width date picker */
  fullWidth?: boolean;
  /** Icon element to display before date picker */
  startIcon?: React.ReactNode;
  /** Icon element to display after date picker */
  endIcon?: React.ReactNode;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * A reusable DatePicker component for selecting dates.
 *
 * Uses the native HTML5 date input with custom styling to match the application design.
 * Provides consistent styling, validation states, and accessibility features for date selection.
 *
 * @example
 * ```tsx
 * // Basic date picker
 * <DatePicker />
 *
 * // Controlled date picker
 * <DatePicker
 *   value={selectedDate}
 *   onChange={handleDateChange}
 * />
 *
 * // Date picker with error state
 * <DatePicker
 *   error
 *   errorMessage="Please select a valid date"
 * />
 *
 * // Date picker with constraints
 * <DatePicker
 *   min="2023-01-01"
 *   max="2023-12-31"
 *   placeholder="Select date"
 * />
 *
 * // Date picker with icon
 * <DatePicker
 *   startIcon={<CalendarIcon />}
 *   aria-label="Select expense date"
 * />
 * ```
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
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
      min,
      max,
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
      placeholder,
    },
    ref,
  ) => {
    // Determine the actual variant based on error/success states
    const actualVariant = error ? 'error' : success ? 'success' : variant;

    // Determine if input is invalid for ARIA
    const isInvalid = error || ariaInvalid === true;

    // Generate unique ID for helper text if not provided
    const helperId = React.useMemo(
      () => (id ? `${id}-helper` : `datepicker-helper-${Math.random().toString(36).substr(2, 9)}`),
      [id],
    );

    const inputClasses = [
      styles.datePicker,
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
            type="date"
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            id={id}
            min={min}
            max={max}
            className={inputClasses}
            aria-label={ariaLabel}
            aria-describedby={
              ariaDescribedBy ||
              (helperText || errorMessage || successMessage ? helperId : undefined)
            }
            aria-invalid={isInvalid}
            data-testid={dataTestId}
            placeholder={placeholder}
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

DatePicker.displayName = 'DatePicker';

export default DatePicker;
