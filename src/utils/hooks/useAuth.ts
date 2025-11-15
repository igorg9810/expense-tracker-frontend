/**
 * Authentication Hook
 *
 * React hook for managing authentication state throughout the application.
 * Provides authentication status, user information, and auth actions.
 */

import { useState, useEffect, useCallback } from 'react';
import { tokenManager, authEvents, authUtils, authApiClient, type AuthEvent } from '../auth';

export interface User {
  userId: string;
  email: string;
}

export interface AuthContextValue {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;

  // Actions
  login: (tokens: { accessToken: string }) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;

  // Utils
  getToken: () => string | null;
  refreshToken: () => Promise<void>;
}

/**
 * useAuth Hook
 *
 * Provides authentication state and methods to components
 */
export const useAuth = (): AuthContextValue => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  /**
   * Update authentication state based on token manager
   */
  const updateAuthState = useCallback(() => {
    const authenticated = tokenManager.isAuthenticated();
    const currentUser = tokenManager.getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  /**
   * Handle authentication events
   */
  const handleAuthEvent = useCallback(
    (event: AuthEvent) => {
      switch (event) {
        case 'login':
        case 'token-refresh':
          updateAuthState();
          break;
        case 'logout':
        case 'auth-error':
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          break;
      }
    },
    [updateAuthState],
  );

  /**
   * Login function
   */
  const login = useCallback(
    (tokens: { accessToken: string }) => {
      authUtils.login(tokens);
      updateAuthState();
    },
    [updateAuthState],
  );

  /**
   * Logout function (current device)
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
      authUtils.logout();
    }
    updateAuthState();
  }, [updateAuthState]);

  /**
   * Logout from all devices
   */
  const logoutAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApiClient.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
      // Continue with local logout even if API call fails
      authUtils.logout();
    }
    updateAuthState();
  }, [updateAuthState]);

  /**
   * Get current access token
   */
  const getToken = useCallback((): string | null => {
    return tokenManager.getAccessToken();
  }, []);

  /**
   * Manual token refresh
   */
  const refreshToken = useCallback(async () => {
    // Token refresh is handled automatically by axios interceptors
    // This is mainly for manual refresh if needed
    try {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.shouldRefreshToken()) {
        // The interceptor will handle the refresh automatically on next request
        console.log('Token refresh will be handled automatically on next request');
      }
    } catch (error) {
      console.error('Manual token refresh error:', error);
      authUtils.handleAuthError(error);
    }
  }, []);

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  /**
   * Listen to auth events
   */
  useEffect(() => {
    const unsubscribe = authEvents.on('login', handleAuthEvent);
    const unsubscribeLogout = authEvents.on('logout', handleAuthEvent);
    const unsubscribeRefresh = authEvents.on('token-refresh', handleAuthEvent);
    const unsubscribeError = authEvents.on('auth-error', handleAuthEvent);

    return () => {
      unsubscribe();
      unsubscribeLogout();
      unsubscribeRefresh();
      unsubscribeError();
    };
  }, [handleAuthEvent]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    logoutAll,
    getToken,
    refreshToken,
  };
};

export default useAuth;
