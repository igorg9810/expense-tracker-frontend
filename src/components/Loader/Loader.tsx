import React from 'react';
import styles from './Loader.module.css';

/**
 * Props for the `Loader` component.
 *
 * @property {number} [rows=12] Number of skeleton rows to display.
 * @property {string} [className] Optional class name for additional styling.
 */
interface LoaderProps {
  rows?: number;
  className?: string;
}

/**
 * A reusable table skeleton loader component that displays placeholder rows
 * while data is loading. Matches the Figma design with checkboxes, avatars,
 * text placeholders, and action icons.
 *
 * Usage:
 * ```tsx
 * <Loader rows={12} />
 * ```
 *
 * @param props Component props.
 * @returns JSX element containing the table skeleton.
 */
const Loader: React.FC<LoaderProps> = ({ rows = 12, className = '' }) => {
  return (
    <div className={`${styles['table-loader-container']} ${className}`}>
      {/* Table Headers */}
      <div className={styles['table-loader-header']}>
        <div className={styles['table-loader-header-cell']}>
          <div className={styles['checkbox-placeholder']}></div>
        </div>
        <div className={`${styles['table-loader-header-cell']} ${styles['header-name']}`}>Name</div>
        <div className={styles['table-loader-header-cell']}>Category</div>
        <div className={styles['table-loader-header-cell']}>Date</div>
        <div className={`${styles['table-loader-header-cell']} ${styles['header-total']}`}>
          Total
        </div>
        <div className={styles['table-loader-header-cell']}></div>
      </div>

      {/* Skeleton Rows */}
      <div className={styles['table-loader-body']}>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={styles['table-loader-row']}
            role="row"
            aria-label={`Loading row ${index + 1}`}
          >
            {/* Checkbox */}
            <div className={styles['table-loader-cell']}>
              <div className={styles['checkbox-placeholder']}></div>
            </div>

            {/* Avatar & Name */}
            <div className={styles['table-loader-cell']}>
              <div className={styles['avatar-placeholder']}></div>
              <div className={styles['text-placeholder']}></div>
            </div>

            {/* Category */}
            <div className={styles['table-loader-cell']}>
              <div
                className={`${styles['text-placeholder']} ${styles['category-placeholder']}`}
              ></div>
            </div>

            {/* Date */}
            <div className={styles['table-loader-cell']}>
              <div className={`${styles['text-placeholder']} ${styles['date-placeholder']}`}></div>
            </div>

            {/* Total */}
            <div className={styles['table-loader-cell']}>
              <div className={`${styles['text-placeholder']} ${styles['total-placeholder']}`}></div>
            </div>

            {/* Action Menu */}
            <div className={styles['table-loader-cell']}>
              <div className={styles['action-icon']}>
                <svg
                  width="4"
                  height="16"
                  viewBox="0 0 4 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="2" cy="2" r="2" fill="#9CA3AF" />
                  <circle cx="2" cy="8" r="2" fill="#9CA3AF" />
                  <circle cx="2" cy="14" r="2" fill="#9CA3AF" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
