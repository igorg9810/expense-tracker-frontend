import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape is disabled', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={false} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when backdrop click is disabled', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnBackdropClick={false} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    const content = screen.getByText('Modal Content');
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        footer={<button>Footer Button</button>}
      >
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    const footer = container.querySelector('[class*="footer"]');
    expect(footer).not.toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies correct maxWidth class', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} maxWidth="lg">
        <div>Modal Content</div>
      </Modal>,
    );

    const modal = container.querySelector('[class*="lg"]');
    expect(modal).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-class">
        <div>Modal Content</div>
      </Modal>,
    );

    const modal = container.querySelector('.custom-class');
    expect(modal).toBeInTheDocument();
  });

  it('prevents body scroll when open', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('has correct accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
