import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from './PasswordInput';

describe('PasswordInput', () => {
  it('renders password input with label', () => {
    render(<PasswordInput label="Password" id="password" />);

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('renders required indicator when required prop is true', () => {
    render(<PasswordInput label="Password" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('toggles password visibility when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" id="password" />);

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Password is required';
    render(<PasswordInput label="Password" error={errorMessage} id="password" />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveClass('error');
  });

  it('displays success message when success prop is true', () => {
    const successMessage = 'Password is valid';
    render(
      <PasswordInput label="Password" success successMessage={successMessage} id="password" />,
    );

    expect(screen.getByText(successMessage)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveClass('success');
  });

  it('displays helper text when provided', () => {
    const helperText = 'Password must be at least 8 characters';
    render(<PasswordInput label="Password" helperText={helperText} />);

    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('applies disabled styles when disabled', () => {
    render(<PasswordInput label="Password" disabled id="password" />);

    const input = screen.getByLabelText('Password');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled');
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<PasswordInput label="Password" onChange={handleChange} id="password" />);

    const input = screen.getByLabelText('Password');
    await user.type(input, 'test123');

    expect(input).toHaveValue('test123');
    expect(handleChange).toHaveBeenCalled();
  });

  it('has correct autocomplete attribute', () => {
    render(<PasswordInput label="Password" id="password" />);

    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'current-password');
  });

  it('error takes precedence over success state', () => {
    render(
      <PasswordInput
        label="Password"
        error="Error message"
        success
        successMessage="Success message"
        id="password"
      />,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveClass('error');
    expect(screen.getByLabelText('Password')).not.toHaveClass('success');
  });
});
