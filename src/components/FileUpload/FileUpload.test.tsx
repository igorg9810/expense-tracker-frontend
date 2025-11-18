import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';

describe('FileUpload Component', () => {
  const mockOnFileSelect = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    expect(screen.getByLabelText('Upload file')).toBeInTheDocument();
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/JPG files only \(max 5MB\)/i)).toBeInTheDocument();
  });

  it('shows uploading state', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} isUploading={true} />);

    expect(screen.getByText(/Uploading invoice.../i)).toBeInTheDocument();
    expect(screen.getByText(/Please wait/i)).toBeInTheDocument();
  });

  it('shows success message when provided', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} successMessage="Upload successful!" />);

    expect(screen.getByText('Upload successful!')).toBeInTheDocument();
  });

  it('disables interaction when disabled', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} disabled={true} />);

    const dropZone = screen.getByLabelText('Upload file');
    expect(dropZone).toHaveAttribute('tabindex', '-1');
  });

  it('disables interaction when uploading', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} isUploading={true} />);

    const dropZone = screen.getByLabelText('Upload file');
    expect(dropZone).toHaveAttribute('tabindex', '-1');
  });

  it('calls onFileSelect with valid JPG file', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('calls onError for non-JPG file', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} onError={mockOnError} />);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Only JPG/JPEG files are allowed');
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });
  });

  it('calls onError for file exceeding size limit', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} onError={mockOnError} />);

    // Create a file larger than 5MB
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('File size must be less than 5.0MB');
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });
  });

  it('handles drag and drop', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByLabelText('Upload file');
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    const dataTransfer = {
      files: [file],
      types: ['Files'],
    };

    fireEvent.dragEnter(dropZone, { dataTransfer });
    fireEvent.dragOver(dropZone, { dataTransfer });
    fireEvent.drop(dropZone, { dataTransfer });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('shows dragging state during drag', () => {
    const { container } = render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByLabelText('Upload file');
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    const dataTransfer = {
      files: [file],
      types: ['Files'],
    };

    fireEvent.dragEnter(dropZone, { dataTransfer });

    const draggingElement = container.querySelector('[class*="dragging"]');
    expect(draggingElement).toBeInTheDocument();

    fireEvent.dragLeave(dropZone);

    const notDragging = container.querySelector('[class*="dragging"]');
    expect(notDragging).not.toBeInTheDocument();
  });

  it('shows preview after file selection', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null as (() => void) | null,
      result: 'data:image/jpeg;base64,abc123',
    };

    global.FileReader = jest.fn(() => mockFileReader) as unknown as typeof FileReader;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    // Trigger FileReader onloadend
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
  });

  it('removes file preview when reset button is clicked', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('File input') as HTMLInputElement;

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null as (() => void) | null,
      result: 'data:image/jpeg;base64,abc123',
    };

    global.FileReader = jest.fn(() => mockFileReader) as unknown as typeof FileReader;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    // Trigger FileReader onloadend
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend();
    }

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });

    const removeButton = screen.getByLabelText('Remove file');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
    });
  });

  it('prevents file selection when disabled', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} disabled={true} />);

    const input = screen.getByLabelText('File input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('prevents file selection when uploading', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} isUploading={true} />);

    const input = screen.getByLabelText('File input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
