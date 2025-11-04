import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with placeholder text', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<Input defaultValue="Default text" />);
    expect(screen.getByDisplayValue('Default text')).toBeInTheDocument();
  });

  it('renders as controlled component with value', () => {
    render(<Input value="Controlled value" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Controlled value')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
  });

  it('calls onFocus when input is focused', async () => {
    const handleFocus = jest.fn();
    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    await userEvent.click(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', async () => {
    const handleBlur = jest.fn();
    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders as read-only when readOnly prop is true', () => {
    render(<Input readOnly />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('renders as required when required prop is true', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('applies error state when error prop is true', () => {
    render(<Input error />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('error');
  });

  it('applies success state when success prop is true', () => {
    render(<Input success />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('success');
  });

  it('renders helper text', () => {
    render(<Input helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders error message when error prop is true', () => {
    render(<Input error errorMessage="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toHaveClass('helperText');
  });

  it('renders success message when success prop is true', () => {
    render(<Input success successMessage="Success message" />);
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toHaveClass('successText');
  });

  it('applies correct size class', () => {
    const { rerender } = render(<Input size="small" />);
    expect(screen.getByRole('textbox')).toHaveClass('small');

    rerender(<Input size="large" />);
    expect(screen.getByRole('textbox')).toHaveClass('large');
  });

  it('applies correct variant class', () => {
    const { rerender } = render(<Input variant="error" />);
    expect(screen.getByRole('textbox')).toHaveClass('error');

    rerender(<Input variant="success" />);
    expect(screen.getByRole('textbox')).toHaveClass('success');
  });

  it('renders with medium size by default', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveClass('medium');
  });

  it('renders with default variant by default', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveClass('default');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders with name and id attributes', () => {
    render(<Input name="testName" id="testId" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'testName');
    expect(input).toHaveAttribute('id', 'testId');
  });

  it('renders with maxLength and minLength attributes', () => {
    render(<Input maxLength={10} minLength={2} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('minLength', '2');
  });

  it('renders with pattern attribute', () => {
    render(<Input pattern="[0-9]+" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '[0-9]+');
  });

  it('has accessible aria-label', () => {
    render(<Input aria-label="Custom label" />);
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });

  it('has accessible aria-describedby', () => {
    render(
      <>
        <div id="help">This field is required</div>
        <Input aria-describedby="help" />
      </>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'help');
  });

  it('has accessible aria-invalid when error', () => {
    render(<Input error />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('has data-testid attribute', () => {
    render(<Input data-testid="test-input" />);
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('renders full width when specified', () => {
    render(<Input fullWidth />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('fullWidth');
  });

  it('renders with start icon', () => {
    const icon = <span data-testid="start-icon">🔍</span>;
    render(<Input startIcon={icon} />);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('withStartIcon');
  });

  it('renders with end icon', () => {
    const icon = <span data-testid="end-icon">✕</span>;
    render(<Input endIcon={icon} />);

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('withEndIcon');
  });

  it('renders with both start and end icons', () => {
    const startIcon = <span data-testid="start-icon">🔍</span>;
    const endIcon = <span data-testid="end-icon">✕</span>;
    render(<Input startIcon={startIcon} endIcon={endIcon} />);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('withStartIcon', 'withEndIcon');
  });

  it('handles key events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('combines multiple props correctly', () => {
    render(
      <Input
        onChange={() => {}}
        type="email"
        placeholder="Enter email"
        value="test@example.com"
        error
        errorMessage="Invalid email"
        size="large"
        fullWidth
        required
        className="custom"
        data-testid="email-input"
      />,
    );

    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveAttribute('value', 'test@example.com');
    expect(input).toHaveClass('error', 'large', 'fullWidth', 'custom');
    expect(input).toBeRequired();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('renders error message with role alert', () => {
    render(<Input error errorMessage="Error occurred" />);
    const errorMessage = screen.getByText('Error occurred');
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('generates unique helper text id when not provided', () => {
    render(<Input helperText="Helper text" />);
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveAttribute('id');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('uses provided id for helper text when available', () => {
    render(<Input id="test-input" helperText="Helper text" />);
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveAttribute('id', 'test-input-helper');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-helper');
  });
});
