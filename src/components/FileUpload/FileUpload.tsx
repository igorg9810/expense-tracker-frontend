import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import styles from './FileUpload.module.css';

export interface FileUploadProps {
  /** Callback when file is selected */
  onFileSelect: (file: File) => void;
  /** Callback when upload error occurs */
  onError?: (error: string) => void;
  /** Accepted file types */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Whether component is disabled */
  disabled?: boolean;
  /** Current upload state */
  isUploading?: boolean;
  /** Success message to display */
  successMessage?: string;
  /** Additional CSS class */
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg'];

/**
 * FileUpload Component
 *
 * Drag & drop file upload component with validation.
 * Supports JPG files up to 5MB.
 */
const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onError,
  accept = '.jpg,.jpeg',
  maxSize = MAX_FILE_SIZE,
  disabled = false,
  isUploading = false,
  successMessage,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validate file type and size
   */
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
      return 'Only JPG/JPEG files are allowed';
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  /**
   * Handle file selection
   */
  const handleFile = (file: File) => {
    const error = validateFile(file);

    if (error) {
      onError?.(error);
      return;
    }

    // Set file name
    setFileName(file.name);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent
    onFileSelect(file);
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Handle click on drop zone
   */
  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Reset upload
   */
  const handleReset = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${
          disabled || isUploading ? styles.disabled : ''
        } ${preview ? styles.hasPreview : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled || isUploading ? -1 : 0}
        aria-label="Upload file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className={styles.fileInput}
          disabled={disabled || isUploading}
          aria-label="File input"
        />

        {isUploading ? (
          <div className={styles.uploadingState}>
            <div className={styles.spinner} />
            <p className={styles.text}>Uploading invoice...</p>
            <p className={styles.subtext}>Please wait</p>
          </div>
        ) : preview ? (
          <div className={styles.previewState}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{fileName}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className={styles.resetButton}
                aria-label="Remove file"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg
              className={styles.icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={styles.text}>
              <span className={styles.highlight}>Click to upload</span> or drag and drop
            </p>
            <p className={styles.subtext}>JPG files only (max 5MB)</p>
          </div>
        )}
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          <svg
            className={styles.successIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
