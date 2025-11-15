import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './SignIn';
import { authApiClient, authUtils } from '../../utils/auth';

// Mock the auth utilities
jest.mock('../../utils/auth', () => ({
  authApiClient: {
    login: jest.fn(),
  },
  authUtils: {
    login: jest.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { state: null };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

const renderSignIn = () => {
  return render(
    <BrowserRouter>
      <SignIn />
    </BrowserRouter>,
  );
};

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in form with all fields', () => {
    renderSignIn();

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Welcome back! Please sign in to your account.')).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.getElementById('password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderSignIn();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    // Type and then clear fields to trigger validation
    await user.type(emailInput, 'test');
    await user.clear(emailInput);
    await user.type(passwordInput, 'test');
    await user.clear(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          accessToken: 'mock-access-token',
          user: { id: 1, email: 'john@example.com', name: 'John Doe' },
        },
      },
    };

    (authApiClient.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'Password123!');

    await user.click(submitButton);

    await waitFor(() => {
      expect(authApiClient.login).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Password123!',
      });
    });
  });

  it('stores token and redirects on successful login', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          accessToken: 'mock-access-token',
          user: { id: 1, email: 'john@example.com', name: 'John Doe' },
        },
      },
    };

    (authApiClient.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'Password123!');

    await user.click(submitButton);

    await waitFor(() => {
      expect(authUtils.login).toHaveBeenCalledWith({
        accessToken: 'mock-access-token',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('shows error message when login fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';

    (authApiClient.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'wrongpassword');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles backend validation errors', async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          errors: {
            email: ['Email is invalid'],
            password: ['Password is too short'],
          },
        },
      },
    };

    (authApiClient.login as jest.Mock).mockRejectedValueOnce(mockError);

    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Use valid format data that will pass client validation but fail on backend
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123');

    // Wait for form to be valid
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      expect(screen.getByText('Password is too short')).toBeInTheDocument();
    });
  });

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup();

    // Mock a successful but delayed response
    (authApiClient.login as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: { token: 'test-token', user: { id: 1, email: 'test@example.com' } },
              }),
            500,
          ),
        ),
    );

    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123');

    // Wait for form to be valid first
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    // Check loading state immediately after clicking
    await waitFor(() => {
      expect(screen.getByText('Signing In...')).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', () => {
    renderSignIn();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid', async () => {
    const user = userEvent.setup();
    renderSignIn();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'Password123!');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });
});
