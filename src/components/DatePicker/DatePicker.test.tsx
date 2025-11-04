import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DatePicker from './DatePicker';

// Helper function to get date input since date inputs don't have textbox role
const getDateInput = () => document.querySelector('input[type="date"]') as HTMLInputElement;

describe('DatePicker', () => {
  it('renders without crashing', () => {
    render(<DatePicker />);
    expect(getDateInput()).toBeInTheDocument();
  });

  it('renders as a date input', () => {
    render(<DatePicker />);
    const input = getDateInput();
    expect(input).toHaveAttribute('type', 'date');
  });

  it('renders with default value', () => {
    render(<DatePicker defaultValue="2023-08-18" />);
    expect(screen.getByDisplayValue('2023-08-18')).toBeInTheDocument();
  });

  it('renders as controlled component with value', () => {
    render(<DatePicker value="2023-08-18" onChange={() => {}} />);
    expect(screen.getByDisplayValue('2023-08-18')).toBeInTheDocument();
  });

  it('calls onChange when date is changed', async () => {
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} />);

    const input = getDateInput();
    await userEvent.type(input, '2023-08-18');

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onFocus when input is focused', async () => {
    const handleFocus = jest.fn();
    render(<DatePicker onFocus={handleFocus} />);

    const input = getDateInput();
    await userEvent.click(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', async () => {
    const handleBlur = jest.fn();
    render(<DatePicker onBlur={handleBlur} />);

    const input = getDateInput();
    await userEvent.click(input);
    await userEvent.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<DatePicker disabled />);
    const input = getDateInput();
    expect(input).toBeDisabled();
  });

  it('renders as read-only when readOnly prop is true', () => {
    render(<DatePicker readOnly />);
    const input = getDateInput();
    expect(input).toHaveAttribute('readonly');
  });

  it('renders as required when required prop is true', () => {
    render(<DatePicker required />);
    const input = getDateInput();
    expect(input).toBeRequired();
  });

  it('applies error state when error prop is true', () => {
    render(<DatePicker error />);
    const input = getDateInput();
    expect(input).toHaveClass('error');
  });

  it('applies success state when success prop is true', () => {
    render(<DatePicker success />);
    const input = getDateInput();
    expect(input).toHaveClass('success');
  });

  it('renders helper text', () => {
    render(<DatePicker helperText="Select a date" />);
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });

  it('renders error message when error prop is true', () => {
    render(<DatePicker error errorMessage="Invalid date" />);
    expect(screen.getByText('Invalid date')).toBeInTheDocument();
    expect(screen.getByText('Invalid date')).toHaveClass('helperText');
  });

  it('renders success message when success prop is true', () => {
    render(<DatePicker success successMessage="Date selected" />);
    expect(screen.getByText('Date selected')).toBeInTheDocument();
    expect(screen.getByText('Date selected')).toHaveClass('successText');
  });

  it('applies correct size class', () => {
    const { rerender } = render(<DatePicker size="small" />);
    expect(getDateInput()).toHaveClass('small');

    rerender(<DatePicker size="large" />);
    expect(getDateInput()).toHaveClass('large');
  });

  it('applies correct variant class', () => {
    const { rerender } = render(<DatePicker variant="error" />);
    expect(getDateInput()).toHaveClass('error');

    rerender(<DatePicker variant="success" />);
    expect(getDateInput()).toHaveClass('success');
  });

  it('renders with medium size by default', () => {
    render(<DatePicker />);
    expect(getDateInput()).toHaveClass('medium');
  });

  it('renders with default variant by default', () => {
    render(<DatePicker />);
    expect(getDateInput()).toHaveClass('default');
  });

  it('applies custom className', () => {
    render(<DatePicker className="custom-class" />);
    const input = getDateInput();
    expect(input).toHaveClass('custom-class');
  });

  it('renders with name and id attributes', () => {
    render(<DatePicker name="dateField" id="dateId" />);
    const input = getDateInput();
    expect(input).toHaveAttribute('name', 'dateField');
    expect(input).toHaveAttribute('id', 'dateId');
  });

  it('renders with min and max attributes', () => {
    render(<DatePicker min="2023-01-01" max="2023-12-31" />);
    const input = getDateInput();
    expect(input).toHaveAttribute('min', '2023-01-01');
    expect(input).toHaveAttribute('max', '2023-12-31');
  });

  it('has accessible aria-label', () => {
    render(<DatePicker aria-label="Select date" />);
    expect(screen.getByLabelText('Select date')).toBeInTheDocument();
  });

  it('has accessible aria-describedby', () => {
    render(
      <>
        <div id="help">Select a valid date</div>
        <DatePicker aria-describedby="help" />
      </>,
    );

    const input = getDateInput();
    expect(input).toHaveAttribute('aria-describedby', 'help');
  });

  it('has accessible aria-invalid when error', () => {
    render(<DatePicker error />);
    const input = getDateInput();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('has data-testid attribute', () => {
    render(<DatePicker data-testid="test-datepicker" />);
    expect(screen.getByTestId('test-datepicker')).toBeInTheDocument();
  });

  it('renders full width when specified', () => {
    render(<DatePicker fullWidth />);
    const input = getDateInput();
    expect(input).toHaveClass('fullWidth');
  });

  it('renders with start icon', () => {
    const icon = <span data-testid="start-icon">📅</span>;
    render(<DatePicker startIcon={icon} />);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(getDateInput()).toHaveClass('withStartIcon');
  });

  it('renders with end icon', () => {
    const icon = <span data-testid="end-icon">📅</span>;
    render(<DatePicker endIcon={icon} />);

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(getDateInput()).toHaveClass('withEndIcon');
  });

  it('renders with both start and end icons', () => {
    const startIcon = <span data-testid="start-icon">📅</span>;
    const endIcon = <span data-testid="end-icon">📅</span>;
    render(<DatePicker startIcon={startIcon} endIcon={endIcon} />);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(getDateInput()).toHaveClass('withStartIcon', 'withEndIcon');
  });

  it('handles key events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    render(<DatePicker onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

    const input = getDateInput();
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('combines multiple props correctly', () => {
    render(
      <DatePicker
        value="2023-08-18"
        error
        errorMessage="Invalid date"
        size="large"
        fullWidth
        required
        className="custom"
        data-testid="date-picker"
        min="2023-01-01"
        max="2023-12-31"
      />,
    );

    const input = screen.getByTestId('date-picker');
    expect(input).toHaveAttribute('value', '2023-08-18');
    expect(input).toHaveClass('error', 'large', 'fullWidth', 'custom');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('min', '2023-01-01');
    expect(input).toHaveAttribute('max', '2023-12-31');
    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<DatePicker ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('renders error message with role alert', () => {
    render(<DatePicker error errorMessage="Date error occurred" />);
    const errorMessage = screen.getByText('Date error occurred');
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('generates unique helper text id when not provided', () => {
    render(<DatePicker helperText="Helper text" />);
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveAttribute('id');

    const input = getDateInput();
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('uses provided id for helper text when available', () => {
    render(<DatePicker id="test-datepicker" helperText="Helper text" />);
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveAttribute('id', 'test-datepicker-helper');

    const input = getDateInput();
    expect(input).toHaveAttribute('aria-describedby', 'test-datepicker-helper');
  });

  it('handles date format correctly', () => {
    render(<DatePicker value="2023-08-18" />);
    const input = getDateInput();
    expect(input).toHaveAttribute('value', '2023-08-18');
  });

  it('validates date constraints', () => {
    render(<DatePicker min="2023-01-01" max="2023-12-31" />);
    const input = getDateInput();
    expect(input).toHaveAttribute('min', '2023-01-01');
    expect(input).toHaveAttribute('max', '2023-12-31');
  });

  it('supports placeholder attribute', () => {
    render(<DatePicker placeholder="Select date" />);
    const input = getDateInput();
    expect(input).toHaveAttribute('placeholder', 'Select date');
  });

  it('handles controlled and uncontrolled modes', () => {
    const { rerender } = render(<DatePicker defaultValue="2023-08-18" />);
    expect(screen.getByDisplayValue('2023-08-18')).toBeInTheDocument();

    rerender(<DatePicker value="2023-09-15" onChange={() => {}} />);
    expect(screen.getByDisplayValue('2023-09-15')).toBeInTheDocument();
  });
});
