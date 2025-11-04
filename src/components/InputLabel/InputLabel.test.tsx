import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputLabel from './InputLabel';

describe('InputLabel', () => {
  it('renders without crashing', () => {
    render(<InputLabel>Test Label</InputLabel>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders children text', () => {
    render(<InputLabel>Name</InputLabel>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders as a label element', () => {
    render(<InputLabel>Test Label</InputLabel>);
    const label = screen.getByText('Test Label').closest('label');
    expect(label).toBeInTheDocument();
  });

  it('applies htmlFor attribute', () => {
    render(<InputLabel htmlFor="name1">Name</InputLabel>);
    const label = screen.getByText('Name').closest('label');
    expect(label).toHaveAttribute('for', 'name1');
  });

  it('renders with default variant', () => {
    render(<InputLabel>Test Label</InputLabel>);
    const label = screen.getByText('Test Label').closest('label');
    expect(label).toHaveClass('default');
  });

  it('applies correct variant class', () => {
    const { rerender } = render(<InputLabel variant="required">Required</InputLabel>);
    expect(screen.getByText('Required').closest('label')).toHaveClass('required');

    rerender(<InputLabel variant="optional">Optional</InputLabel>);
    expect(screen.getByText('Optional').closest('label')).toHaveClass('optional');
  });

  it('applies correct size class', () => {
    const { rerender } = render(<InputLabel size="small">Small</InputLabel>);
    expect(screen.getByText('Small').closest('label')).toHaveClass('small');

    rerender(<InputLabel size="large">Large</InputLabel>);
    expect(screen.getByText('Large').closest('label')).toHaveClass('large');
  });

  it('renders with medium size by default', () => {
    render(<InputLabel>Medium</InputLabel>);
    expect(screen.getByText('Medium').closest('label')).toHaveClass('medium');
  });

  it('shows required indicator when required prop is true', () => {
    render(<InputLabel required>Required Field</InputLabel>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows optional indicator when variant is optional', () => {
    render(<InputLabel variant="optional">Optional Field</InputLabel>);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('applies disabled class when disabled', () => {
    render(<InputLabel disabled>Disabled Field</InputLabel>);
    const label = screen.getByText('Disabled Field').closest('label');
    expect(label).toHaveClass('disabled');
  });

  it('applies custom className', () => {
    render(<InputLabel className="custom-class">Custom</InputLabel>);
    const label = screen.getByText('Custom').closest('label');
    expect(label).toHaveClass('custom-class');
  });

  it('has accessible aria-label', () => {
    render(<InputLabel aria-label="Custom label">Label</InputLabel>);
    const label = screen.getByLabelText('Custom label');
    expect(label).toBeInTheDocument();
  });

  it('has accessible aria-describedby', () => {
    render(
      <>
        <div id="help">This field is required</div>
        <InputLabel aria-describedby="help">Name</InputLabel>
      </>,
    );

    const label = screen.getByText('Name').closest('label');
    expect(label).toHaveAttribute('aria-describedby', 'help');
  });

  it('has data-testid attribute', () => {
    render(<InputLabel data-testid="test-label">Test</InputLabel>);
    const label = screen.getByTestId('test-label');
    expect(label).toBeInTheDocument();
  });

  it('renders without children gracefully', () => {
    render(<InputLabel />);
    const label = screen.getByRole('generic');
    expect(label).toBeInTheDocument();
  });

  it('combines multiple props correctly', () => {
    render(
      <InputLabel
        htmlFor="email"
        variant="required"
        size="large"
        required
        className="custom"
        data-testid="email-label"
      >
        Email Address
      </InputLabel>,
    );

    const label = screen.getByTestId('email-label');
    expect(label).toHaveAttribute('for', 'email');
    expect(label).toHaveClass('required', 'large', 'custom');
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders required indicator with aria-hidden', () => {
    render(<InputLabel required>Required</InputLabel>);
    const indicator = screen.getByText('*');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders optional indicator with aria-hidden', () => {
    render(<InputLabel variant="optional">Optional</InputLabel>);
    const indicator = screen.getByText('(optional)');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
  });
});
