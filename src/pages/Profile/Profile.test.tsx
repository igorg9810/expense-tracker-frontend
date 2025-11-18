import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import { useAuth } from '../../utils/hooks';
import { authApiClient } from '../../utils/auth';

// Mock the auth hooks and API client
jest.mock('../../utils/hooks', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../utils/auth', () => ({
  authApiClient: {
    getUserProfile: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>,
  );
};

describe('Profile', () => {
  const mockUser = {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
  };

  const mockProfileData = {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
      isLoading: false,
    });
  });

  it('renders profile page with user information', async () => {
    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: mockProfileData,
    });

    renderProfile();

    // Check for loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
      expect(screen.getAllByText('john@example.com')).toHaveLength(2); // Header and profile content
    });
  });

  it('shows loading state while fetching profile data', () => {
    (authApiClient.getUserProfile as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    renderProfile();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message when profile fetch fails', async () => {
    const errorMessage = 'Failed to fetch profile';
    (useAuth as jest.Mock).mockReturnValue({
      user: null, // No user data to prevent fallback
      logout: jest.fn(),
      isLoading: false,
    });

    (authApiClient.getUserProfile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });

  it('has retry button when profile fetch fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null, // No user data to prevent fallback
      logout: jest.fn(),
      isLoading: false,
    });

    (authApiClient.getUserProfile as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderProfile();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  it('retries fetching profile data when retry button is clicked', async () => {
    const user = userEvent.setup();

    // Setup auth context with no user initially for error state
    const mockAuthContext = {
      user: null,
      logout: jest.fn(),
      isLoading: false,
    };

    (useAuth as jest.Mock).mockReturnValue(mockAuthContext);

    // First call fails, second succeeds
    (authApiClient.getUserProfile as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ data: mockProfileData });

    renderProfile();

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    // Should call getUserProfile again
    expect(authApiClient.getUserProfile).toHaveBeenCalledTimes(2);

    // Should show profile data after successful retry
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    });
  });

  it('handles logout functionality', async () => {
    const user = userEvent.setup();
    const mockLogout = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isLoading: false,
    });

    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: mockProfileData,
    });

    renderProfile();

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: '🚪 Logout' });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('displays profile data correctly', async () => {
    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: mockProfileData,
    });

    renderProfile();

    await waitFor(() => {
      // Check for date components (timezone-independent)
      expect(screen.getAllByText(/January 1, 2023/i)).toHaveLength(2); // Account Created and Last Updated
      expect(screen.getAllByText('john@example.com')).toHaveLength(2); // Header and profile content
    });
  });

  it('has navigation link back to expenses', async () => {
    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: mockProfileData,
    });

    renderProfile();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to dashboard/i })).toBeInTheDocument();
    });
  });

  it('renders profile when user is authenticated', async () => {
    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: mockProfileData,
    });

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    });
  });

  it('shows loading state when auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logout: jest.fn(),
      isLoading: true,
    });

    renderProfile();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays user avatar placeholder', async () => {
    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: mockProfileData,
    });

    const { container } = renderProfile();

    await waitFor(() => {
      const avatarText = container.querySelector('.avatarText');
      expect(avatarText).toBeInTheDocument();
      expect(avatarText).toHaveTextContent('J');
    });
  });

  it('formats dates correctly', async () => {
    const profileWithDifferentDate = {
      ...mockProfileData,
      createdAt: '2023-12-25T15:30:00.000Z',
    };

    (authApiClient.getUserProfile as jest.Mock).mockResolvedValueOnce({
      data: profileWithDifferentDate,
    });

    renderProfile();

    await waitFor(() => {
      const dateElements = screen.getAllByText(/december 25, 2023/i);
      expect(dateElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
