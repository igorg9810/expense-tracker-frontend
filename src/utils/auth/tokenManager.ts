/**
 * Token Management System using Closures
 *
 * This module manages JWT access tokens without storing them in localStorage
 * or sessionStorage for security reasons. Instead, it uses closures to keep
 * the access token in memory.
 *
 * Features:
 * - Secure token storage using closures
 * - Automatic token refresh when expired
 * - Token validation and expiration checking
 * - TypeScript support with proper interfaces
 */

// Token interfaces
export interface TokenPayload {
  exp: number;
  iat: number;
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string; // Optional as it's handled via HTTP-only cookies
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

// Token management using closures
const createTokenManager = () => {
  let accessToken: string | null = null;
  let tokenExpirationTime: number | null = null;

  /**
   * Decodes JWT token payload without verification
   * Used for reading expiration time and user info
   */
  const decodeToken = (token: string): TokenPayload | null => {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = JSON.parse(atob(payload));
      return decoded as TokenPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  /**
   * Checks if a token is expired
   * Adds 30 seconds buffer to prevent edge cases
   */
  const isTokenExpired = (token: string): boolean => {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    // Check if exp is a valid number
    if (typeof payload.exp !== 'number' || isNaN(payload.exp)) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30; // 30 seconds buffer

    return payload.exp <= currentTime + bufferTime;
  };

  /**
   * Sets the access token and calculates expiration time
   */
  const setAccessToken = (token: string | null): void => {
    accessToken = token;

    if (token) {
      const payload = decodeToken(token);
      tokenExpirationTime = payload?.exp ? payload.exp * 1000 : null;
    } else {
      tokenExpirationTime = null;
    }
  };

  /**
   * Gets the current access token
   */
  const getAccessToken = (): string | null => {
    return accessToken;
  };

  /**
   * Checks if user is authenticated (has valid token)
   */
  const isAuthenticated = (): boolean => {
    if (!accessToken) return false;
    return !isTokenExpired(accessToken);
  };

  /**
   * Gets token expiration time in milliseconds
   */
  const getTokenExpiration = (): number | null => {
    return tokenExpirationTime;
  };

  /**
   * Gets decoded token payload
   */
  const getTokenPayload = (): TokenPayload | null => {
    if (!accessToken) return null;
    return decodeToken(accessToken);
  };

  /**
   * Gets user information from token
   */
  const getCurrentUser = (): { userId: string; email: string } | null => {
    const payload = getTokenPayload();
    if (!payload) return null;

    return {
      userId: payload.userId,
      email: payload.email,
    };
  };

  /**
   * Clears all tokens (logout)
   */
  const clearTokens = (): void => {
    accessToken = null;
    tokenExpirationTime = null;
  };

  /**
   * Checks if token needs refresh (expires in next 5 minutes)
   */
  const shouldRefreshToken = (): boolean => {
    if (!accessToken || !tokenExpirationTime) return false;

    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return tokenExpirationTime <= fiveMinutesFromNow;
  };

  // Return public interface
  return {
    setAccessToken,
    getAccessToken,
    isAuthenticated,
    getTokenExpiration,
    getTokenPayload,
    getCurrentUser,
    clearTokens,
    shouldRefreshToken,
    isTokenExpired: (token: string) => isTokenExpired(token),
    decodeToken,
  };
};

// Create singleton instance
export const tokenManager = createTokenManager();

// Auth events for components to listen to
export type AuthEvent = 'login' | 'logout' | 'token-refresh' | 'auth-error';

export interface AuthEventListener {
  (event: AuthEvent, data?: unknown): void;
}

// Simple event emitter for auth state changes
const createAuthEventEmitter = () => {
  const listeners: Map<AuthEvent, Set<AuthEventListener>> = new Map();

  const on = (event: AuthEvent, listener: AuthEventListener): (() => void) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)!.add(listener);

    // Return cleanup function
    return () => {
      listeners.get(event)?.delete(listener);
    };
  };

  const emit = (event: AuthEvent, data?: unknown): void => {
    listeners.get(event)?.forEach((listener) => {
      try {
        listener(event, data);
      } catch (error) {
        console.error(`Error in auth event listener for ${event}:`, error);
      }
    });
  };

  const off = (event: AuthEvent, listener: AuthEventListener): void => {
    listeners.get(event)?.delete(listener);
  };

  return { on, emit, off };
};

export const authEvents = createAuthEventEmitter();

// Utility functions for common auth operations
export const authUtils = {
  /**
   * Sets up authentication state after successful login
   */
  login: (tokens: AuthTokens) => {
    tokenManager.setAccessToken(tokens.accessToken);
    authEvents.emit('login', tokens);
  },

  /**
   * Clears authentication state on logout
   */
  logout: () => {
    tokenManager.clearTokens();
    authEvents.emit('logout');
  },

  /**
   * Updates tokens after refresh
   */
  refreshTokens: (tokens: TokenRefreshResponse) => {
    tokenManager.setAccessToken(tokens.accessToken);
    authEvents.emit('token-refresh', tokens);
  },

  /**
   * Handles authentication errors
   */
  handleAuthError: (error: unknown) => {
    console.error('Authentication error:', error);
    authEvents.emit('auth-error', error);

    // Clear tokens on auth error
    const isAxiosError = (err: unknown): err is { response?: { status?: number } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    if (isAxiosError(error) && error.response?.status === 401) {
      authUtils.logout();
    }
  },
};

export default tokenManager;
