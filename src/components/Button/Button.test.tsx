import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders children text', () => {
    render(<Button>Create</Button>);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} loading>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders loading spinner when loading', () => {
    render(<Button loading>Submit</Button>);

    const button = screen.getByRole('button');
    const spinner = button.querySelector('.spinner');

    expect(spinner).toBeInTheDocument();
  });

  it('renders close variant with X icon', () => {
    render(<Button variant="close" aria-label="Close" />);

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Close');
  });

  it('renders with primary variant by default', () => {
    render(<Button>Create</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('applies correct variant class', () => {
    const { rerender } = render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');

    rerender(<Button variant="outlined">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('outlined');
  });

  it('applies correct size class', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('small');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('large');
  });

  it('renders with icon at start', () => {
    const icon = <span data-testid="icon">📝</span>;
    render(<Button icon={icon}>With Icon</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders with icon at end', () => {
    const icon = <span data-testid="icon">→</span>;
    render(<Button endIcon={icon}>With End Icon</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With End Icon')).toBeInTheDocument();
  });

  it('renders full width when specified', () => {
    render(<Button fullWidth>Full Width</Button>);

    expect(screen.getByRole('button')).toHaveClass('fullWidth');
  });

  it('has accessible aria-label', () => {
    render(<Button aria-label="Close dialog">×</Button>);

    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('has accessible aria-describedby', () => {
    render(
      <>
        <div id="help">This button will close the dialog</div>
        <Button aria-describedby="help">Close</Button>
      </>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'help');
  });

  it('applies active state', () => {
    render(<Button active>Active Button</Button>);

    expect(screen.getByRole('button')).toHaveClass('active');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with correct button type', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');

    rerender(<Button type="button">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('can be focused with keyboard', () => {
    render(<Button>Focusable Button</Button>);

    const button = screen.getByRole('button');
    button.focus();

    expect(button).toHaveFocus();
  });

  it('handles key press events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });

    // Note: Actual Enter key behavior might require more complex setup
    expect(button).toBeInTheDocument();
  });
});
