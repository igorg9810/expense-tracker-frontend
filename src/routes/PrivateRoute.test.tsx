import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../utils/hooks';

// Mock the auth hook
jest.mock('../utils/hooks', () => ({
  useAuth: jest.fn(),
}));

// Mock react-router-dom Navigate component and useLocation
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(({ to, state, replace }) => {
    mockNavigate(to, state, replace);
    return <div data-testid="navigate-component">Redirecting to {to}</div>;
  }),
  useLocation: () => mockUseLocation(),
}));

const TestComponent = () => <div>Protected Content</div>;

const renderPrivateRoute = () => {
  return render(
    <BrowserRouter>
      <PrivateRoute>
        <TestComponent />
      </PrivateRoute>
    </BrowserRouter>,
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default location mock
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
  });

  it('renders children when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderPrivateRoute();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
  });

  it('shows loader when authentication is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    renderPrivateRoute();

    expect(screen.getByLabelText('Loading row 1')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
  });

  it('redirects to sign-in when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderPrivateRoute();

    expect(screen.getByTestId('navigate-component')).toBeInTheDocument();
    expect(screen.getByText('Redirecting to /auth/sign-in')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('passes current location as state when redirecting', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    // Set up specific location for this test
    const mockLocation = {
      pathname: '/protected-page',
      search: '',
      hash: '',
      state: null,
      key: 'test',
    };
    mockUseLocation.mockReturnValue(mockLocation);

    renderPrivateRoute();

    expect(mockNavigate).toHaveBeenCalledWith('/auth/sign-in', { from: mockLocation }, true);
  });

  it('uses replace navigation when redirecting', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderPrivateRoute();

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      true, // replace parameter
    );
  });

  it('handles multiple children components', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <PrivateRoute>
          <div>Child 1</div>
          <div>Child 2</div>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('handles authentication state changes', () => {
    const mockUseAuth = useAuth as jest.Mock;

    // Initially not authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { rerender } = renderPrivateRoute();

    expect(screen.getByTestId('navigate-component')).toBeInTheDocument();

    // User becomes authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    rerender(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
  });

  it('handles loading state transitions', () => {
    const mockUseAuth = useAuth as jest.Mock;

    // Initially loading
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { rerender } = renderPrivateRoute();

    expect(screen.getByLabelText('Loading row 1')).toBeInTheDocument();

    // Loading finishes, user is authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    rerender(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
