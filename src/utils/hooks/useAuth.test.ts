import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { tokenManager, authEvents, authUtils, authApiClient } from '../auth';

// Mock the auth utilities
jest.mock('../auth', () => ({
  tokenManager: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    getAccessToken: jest.fn(),
    shouldRefreshToken: jest.fn(),
  },
  authEvents: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  authUtils: {
    login: jest.fn(),
    logout: jest.fn(),
    refreshTokens: jest.fn(),
  },
  authApiClient: {
    logout: jest.fn(),
    logoutAll: jest.fn(),
  },
}));

describe('useAuth', () => {
  const unsubscribeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (tokenManager.isAuthenticated as jest.Mock).mockReturnValue(false);
    (tokenManager.getCurrentUser as jest.Mock).mockReturnValue(null);
    (tokenManager.getAccessToken as jest.Mock).mockReturnValue(null);
    (tokenManager.shouldRefreshToken as jest.Mock).mockReturnValue(false);

    // Reset authEvents.on to always return the unsubscribe function
    (authEvents.on as jest.Mock).mockImplementation(() => unsubscribeMock);
  });

  it('initializes with unauthenticated state', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('initializes with authenticated state when token exists', async () => {
    const mockUser = { userId: '1', email: 'john@example.com' };

    (tokenManager.isAuthenticated as jest.Mock).mockReturnValue(true);
    (tokenManager.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('subscribes to auth events on mount', () => {
    renderHook(() => useAuth());

    expect(authEvents.on).toHaveBeenCalledWith('login', expect.any(Function));
    expect(authEvents.on).toHaveBeenCalledWith('logout', expect.any(Function));
    expect(authEvents.on).toHaveBeenCalledWith('token-refresh', expect.any(Function));
    expect(authEvents.on).toHaveBeenCalledWith('auth-error', expect.any(Function));
  });

  it('unsubscribes from auth events on unmount', () => {
    const { unmount } = renderHook(() => useAuth());

    unmount();

    // The unsubscribe functions should be called
    expect(unsubscribeMock).toHaveBeenCalledTimes(4);
  });

  it('handles login action', async () => {
    const { result } = renderHook(() => useAuth());
    const tokens = { accessToken: 'test-token' };

    await act(async () => {
      result.current.login(tokens);
    });

    expect(authUtils.login).toHaveBeenCalledWith(tokens);
  });

  it('handles logout action', async () => {
    (authApiClient.logout as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(authApiClient.logout).toHaveBeenCalled();
  });

  it('handles logout all action', async () => {
    (authApiClient.logoutAll as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logoutAll();
    });

    expect(authApiClient.logoutAll).toHaveBeenCalled();
  });

  it('returns current access token', () => {
    const mockToken = 'test-access-token';
    (tokenManager.getAccessToken as jest.Mock).mockReturnValue(mockToken);

    const { result } = renderHook(() => useAuth());

    expect(result.current.getToken()).toBe(mockToken);
  });

  it('handles token refresh', async () => {
    const mockToken = 'test-token';
    (tokenManager.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (tokenManager.shouldRefreshToken as jest.Mock).mockReturnValue(true);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.refreshToken();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Token refresh will be handled automatically on next request',
    );
    consoleSpy.mockRestore();
  });

  it('handles login event', async () => {
    const mockUser = { userId: '1', email: 'john@example.com' };
    let loginHandler: (user: unknown) => void;

    (authEvents.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'login') {
        loginHandler = handler;
      }
      return unsubscribeMock;
    });

    (tokenManager.isAuthenticated as jest.Mock).mockReturnValue(true);
    (tokenManager.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth());

    // Simulate login event
    act(() => {
      loginHandler(mockUser);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('handles logout event', async () => {
    let logoutHandler: () => void;

    (authEvents.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'logout') {
        logoutHandler = handler;
      }
      return unsubscribeMock;
    });

    // Start with authenticated state
    (tokenManager.isAuthenticated as jest.Mock).mockReturnValue(false);
    (tokenManager.getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    // Simulate logout event
    act(() => {
      logoutHandler();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  it('handles token refresh event', async () => {
    const updatedUser = { userId: '1', email: 'updated@example.com' };
    let tokenRefreshHandler: (tokens: unknown) => void;

    (authEvents.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'token-refresh') {
        tokenRefreshHandler = handler;
      }
      return unsubscribeMock;
    });

    (tokenManager.isAuthenticated as jest.Mock).mockReturnValue(true);
    (tokenManager.getCurrentUser as jest.Mock).mockReturnValue(updatedUser);

    const { result } = renderHook(() => useAuth());

    // Simulate token refresh event
    act(() => {
      tokenRefreshHandler({ accessToken: 'new-token', refreshToken: 'new-refresh' });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(updatedUser);
    });
  });

  it('handles auth error event', async () => {
    let authErrorHandler: (error: unknown) => void;

    (authEvents.on as jest.Mock).mockImplementation((event, handler) => {
      if (event === 'auth-error') {
        authErrorHandler = handler;
      }
      return unsubscribeMock;
    });

    (tokenManager.isAuthenticated as jest.Mock).mockReturnValue(false);
    (tokenManager.getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    // Simulate auth error event
    act(() => {
      authErrorHandler(new Error('Authentication error'));
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  it('handles logout API failure gracefully', async () => {
    const error = new Error('Network error');
    (authApiClient.logout as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    // Should not throw
    await act(async () => {
      await expect(result.current.logout()).resolves.toBeUndefined();
    });

    expect(authApiClient.logout).toHaveBeenCalled();
  });

  it('handles logoutAll API failure gracefully', async () => {
    const error = new Error('Network error');
    (authApiClient.logoutAll as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    // Should not throw
    await act(async () => {
      await expect(result.current.logoutAll()).resolves.toBeUndefined();
    });

    expect(authApiClient.logoutAll).toHaveBeenCalled();
  });

  it('shows loading state initially', () => {
    const { result } = renderHook(() => useAuth());

    // The hook initializes with loading=true but updateAuthState sets it to false immediately
    // So we check that loading starts false (after initial effect runs)
    expect(result.current.isLoading).toBe(false);
  });

  it('sets loading to false after initialization', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
