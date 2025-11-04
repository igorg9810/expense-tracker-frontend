import React from 'react';
import styles from './Icon.module.css';
import { iconRegistry, type IconName } from '../../assets/icons';

export type IconSize = 'small' | 'medium' | 'large' | number;
export type IconColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | string;

interface IconProps {
  /** Name of the icon to render */
  iconName: IconName;
  /** Size of the icon */
  size?: IconSize;
  /** Color of the icon */
  color?: IconColor;
  /** Additional CSS class */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Whether the icon is decorative (hidden from screen readers) */
  decorative?: boolean;
  /** Custom data attributes */
  'data-testid'?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  /** Mouse enter handler */
  onMouseEnter?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  /** Mouse leave handler */
  onMouseLeave?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  /** Custom style object */
  style?: React.CSSProperties;
}

/**
 * A reusable Icon component for rendering SVG icons.
 *
 * Provides consistent sizing, coloring, and accessibility features for SVG icons.
 * Supports predefined icon names from the icon registry with customizable sizes and colors.
 *
 * @example
 * ```tsx
 * // Basic icon
 * <Icon iconName="plus" />
 *
 * // Icon with custom size and color
 * <Icon iconName="plus" size={15} color="white" />
 *
 * // Icon with accessibility label
 * <Icon iconName="search" aria-label="Search" />
 *
 * // Decorative icon (hidden from screen readers)
 * <Icon iconName="close" decorative />
 *
 * // Clickable icon
 * <Icon iconName="edit" onClick={handleEdit} />
 *
 * // Icon with custom styling
 * <Icon
 *   iconName="trash"
 *   size="large"
 *   color="error"
 *   className="custom-icon"
 *   onClick={handleDelete}
 * />
 * ```
 */
const Icon: React.FC<IconProps> = ({
  iconName,
  size = 'medium',
  color = 'default',
  className = '',
  'aria-label': ariaLabel,
  decorative = false,
  'data-testid': dataTestId,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}) => {
  // Get the SVG component from the registry
  const SvgComponent = iconRegistry[iconName];

  if (!SvgComponent) {
    console.warn(`Icon "${iconName}" not found in icon registry`);
    return null;
  }

  // Determine the actual size
  const actualSize = typeof size === 'number' ? size : getSizeValue(size);

  // Determine if the icon is clickable
  const isClickable = !!onClick;

  // Build CSS classes
  const iconClasses = [
    styles.icon,
    styles[`size-${typeof size === 'string' ? size : 'custom'}`],
    styles[`color-${color}`],
    isClickable && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine accessibility attributes
  const accessibilityProps = decorative
    ? { 'aria-hidden': true }
    : ariaLabel
      ? { 'aria-label': ariaLabel }
      : { 'aria-hidden': true };

  // Custom style for numeric sizes
  const customStyle =
    typeof size === 'number' ? { ...style, width: actualSize, height: actualSize } : style;

  return (
    <span
      className={iconClasses}
      data-testid={dataTestId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={customStyle}
      {...accessibilityProps}
    >
      <SvgComponent width={actualSize} height={actualSize} className={styles.svg} />
    </span>
  );
};

// Helper function to get size values
const getSizeValue = (size: 'small' | 'medium' | 'large'): number => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };
  return sizeMap[size];
};

export default Icon;
