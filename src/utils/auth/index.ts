/**
 * Authentication Utilities Index
 *
 * This barrel file exports all authentication-related utilities
 * for easy importing throughout the application.
 */

// Token management
export {
  tokenManager,
  authEvents,
  authUtils,
  type TokenPayload,
  type AuthTokens,
  type TokenRefreshResponse,
  type AuthEvent,
  type AuthEventListener,
} from './tokenManager';

// API client and utilities
export { apiClient, authApiClient, apiUtils } from './apiClient';

// Re-export default API client
export { default } from './apiClient';
