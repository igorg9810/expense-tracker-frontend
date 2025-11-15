/**
 * Axios Configuration with Token Interceptors
 *
 * This module sets up axios with automatic token management:
 * - Adds access tokens to all requests
 * - Handles token refresh automatically when tokens expire
 * - Manages authentication errors and redirects
 * - Provides a configured axios instance for the entire app
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { tokenManager, authUtils, type TokenRefreshResponse } from './tokenManager';

// API configuration
const API_BASE_URL =
  (globalThis as { import?: { meta?: { env?: { VITE_API_BASE_URL?: string } } } }).import?.meta?.env
    ?.VITE_API_BASE_URL || 'http://localhost:3000';
const TOKEN_REFRESH_ENDPOINT = '/api/auth/token';

// Request retry configuration (for future use)
// const MAX_RETRY_ATTEMPTS = 1;
// const RETRY_DELAY = 1000; // 1 second

/**
 * Create axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for refresh token cookies
  });

  // Track ongoing refresh requests to prevent multiple simultaneous refreshes
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  /**
   * Process failed queue after token refresh
   */
  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      } else {
        reject(new Error('No token available'));
      }
    });

    failedQueue = [];
  };

  /**
   * Refresh access token using refresh token (cookie)
   */
  const refreshAccessToken = async (): Promise<string> => {
    try {
      const response = await axios.post<TokenRefreshResponse>(
        `${API_BASE_URL}${TOKEN_REFRESH_ENDPOINT}`,
        {}, // Empty body, refresh token is in HTTP-only cookie
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { accessToken } = response.data;

      // Update token in memory
      authUtils.refreshTokens(response.data);

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);

      // Clear tokens and emit auth error
      authUtils.handleAuthError(error);

      throw error;
    }
  };

  /**
   * Request interceptor - adds access token to requests
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  /**
   * Response interceptor - handles token refresh on 401 errors
   */
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If refresh is in progress, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);

          // Redirect to login or handle auth error
          authUtils.handleAuthError(refreshError);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Create and export the configured axios instance
export const apiClient = createApiClient();

// Export additional utilities for specific use cases
export const authApiClient = {
  /**
   * Login request without token (for initial authentication)
   */
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/sign-in`, credentials, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  /**
   * Sign up request without token
   */
  signUp: async (userData: { name: string; email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/sign-up`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  /**
   * Logout request (clears refresh token cookie)
   */
  logout: async () => {
    try {
      await apiClient.get('/api/auth/logout');
    } catch (error) {
      // Even if logout fails on backend, clear local tokens
      console.error('Logout request failed:', error);
    } finally {
      authUtils.logout();
    }
  },

  /**
   * Logout from all devices
   */
  logoutAll: async () => {
    try {
      await apiClient.get('/api/auth/logoutAll');
    } catch (error) {
      console.error('Logout all request failed:', error);
    } finally {
      authUtils.logout();
    }
  },

  /**
   * Get user profile data
   */
  getUserProfile: async () => {
    return await apiClient.get('/api/users/me');
  },
};

// Export utility functions for API requests
export const apiUtils = {
  /**
   * Generic GET request with error handling
   */
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * Generic POST request with error handling
   */
  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * Generic PUT request with error handling
   */
  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * Generic DELETE request with error handling
   */
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  /**
   * Check if error is an authentication error
   */
  isAuthError: (error: unknown): boolean => {
    const isAxiosError = (err: unknown): err is { response?: { status?: number } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };
    return isAxiosError(error) && error.response?.status === 401;
  },

  /**
   * Check if error is a validation error
   */
  isValidationError: (error: unknown): boolean => {
    const isAxiosError = (err: unknown): err is { response?: { status?: number } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };
    return (
      isAxiosError(error) && (error.response?.status === 422 || error.response?.status === 400)
    );
  },
};

// Default export
export default apiClient;
