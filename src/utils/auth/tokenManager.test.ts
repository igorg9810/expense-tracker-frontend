import tokenManager from './tokenManager';

// Mock console methods to avoid cluttering test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('TokenManager', () => {
  beforeEach(() => {
    // Clear any existing tokens before each test
    tokenManager.clearTokens();
  });

  describe('setAccessToken', () => {
    it('stores access token', () => {
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2NzAwMDAwMDB9.test';

      tokenManager.setAccessToken(mockToken);

      expect(tokenManager.getAccessToken()).toBe(mockToken);
    });

    it('clears token when null is provided', () => {
      const mockToken = 'test-token';
      tokenManager.setAccessToken(mockToken);

      tokenManager.setAccessToken(null);

      expect(tokenManager.getAccessToken()).toBe(null);
    });
  });

  describe('getAccessToken', () => {
    it('returns null when no token is set', () => {
      expect(tokenManager.getAccessToken()).toBe(null);
    });

    it('returns the stored token', () => {
      const mockToken = 'test-token';
      tokenManager.setAccessToken(mockToken);

      expect(tokenManager.getAccessToken()).toBe(mockToken);
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no token is set', () => {
      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('returns false when token is invalid', () => {
      tokenManager.setAccessToken('invalid-token');

      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('returns false when token is expired', () => {
      // Create expired token (exp in the past)
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNjcwMDAwMDAwLCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(expiredToken);

      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('returns true when token is valid and not expired', () => {
      // Create token that expires far in the future
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(validToken);

      expect(tokenManager.isAuthenticated()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no token is set', () => {
      expect(tokenManager.getCurrentUser()).toBe(null);
    });

    it('returns null when token is invalid', () => {
      tokenManager.setAccessToken('invalid-token');

      expect(tokenManager.getCurrentUser()).toBe(null);
    });

    it('returns user data from valid token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(validToken);

      const user = tokenManager.getCurrentUser();

      expect(user).toEqual({
        userId: '1',
        email: 'john@example.com',
      });
    });
  });

  describe('isTokenExpired', () => {
    it('returns true when no token is set', () => {
      expect(tokenManager.isTokenExpired('')).toBe(true);
    });

    it('returns true when token is invalid', () => {
      const invalidToken = 'invalid-token';
      tokenManager.setAccessToken(invalidToken);

      expect(tokenManager.isTokenExpired(invalidToken)).toBe(true);
    });

    it('returns true when token is expired', () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNjcwMDAwMDAwLCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(expiredToken);

      expect(tokenManager.isTokenExpired(expiredToken)).toBe(true);
    });

    it('returns false when token is valid and not expired', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(validToken);

      expect(tokenManager.isTokenExpired(validToken)).toBe(false);
    });
  });

  describe('getTokenExpiration', () => {
    it('returns null when no token is set', () => {
      expect(tokenManager.getTokenExpiration()).toBe(null);
    });

    it('returns null when token is invalid', () => {
      tokenManager.setAccessToken('invalid-token');

      expect(tokenManager.getTokenExpiration()).toBe(null);
    });

    it('returns expiration time for valid token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(validToken);

      expect(tokenManager.getTokenExpiration()).toBe(9999999999 * 1000); // Should be in milliseconds
    });
  });

  describe('clearTokens', () => {
    it('clears all stored tokens and data', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2NzAwMDAwMDB9.test';
      tokenManager.setAccessToken(validToken);

      // Verify token is set
      expect(tokenManager.getAccessToken()).toBe(validToken);
      expect(tokenManager.isAuthenticated()).toBe(true);

      tokenManager.clearTokens();

      // Verify everything is cleared
      expect(tokenManager.getAccessToken()).toBe(null);
      expect(tokenManager.isAuthenticated()).toBe(false);
      expect(tokenManager.getCurrentUser()).toBe(null);
      expect(tokenManager.getTokenExpiration()).toBe(null);
    });
  });

  describe('error handling', () => {
    it('handles malformed JWT tokens gracefully', () => {
      const malformedToken = 'not.a.jwt';
      tokenManager.setAccessToken(malformedToken);

      expect(tokenManager.isAuthenticated()).toBe(false);
      expect(tokenManager.getCurrentUser()).toBe(null);
      expect(tokenManager.isTokenExpired(malformedToken)).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('handles JWT tokens with invalid base64 encoding', () => {
      const invalidBase64Token = 'header.invalid-base64.signature';
      tokenManager.setAccessToken(invalidBase64Token);

      expect(tokenManager.isAuthenticated()).toBe(false);
      expect(tokenManager.getCurrentUser()).toBe(null);
      expect(console.error).toHaveBeenCalled();
    });

    it('handles JWT tokens with missing parts', () => {
      const incompleteToken = 'header.payload'; // Missing signature
      tokenManager.setAccessToken(incompleteToken);

      expect(tokenManager.isAuthenticated()).toBe(false);
      expect(tokenManager.getCurrentUser()).toBe(null);
    });
  });

  describe('token validation edge cases', () => {
    it('handles tokens without expiration', () => {
      // Token without exp claim
      const tokenWithoutExp =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjcwMDAwMDAwfQ.test';
      tokenManager.setAccessToken(tokenWithoutExp);

      expect(tokenManager.isTokenExpired(tokenWithoutExp)).toBe(true);
      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('handles tokens with non-numeric expiration', () => {
      // Token with invalid exp claim
      const invalidExpToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoiaW52YWxpZCIsImlhdCI6MTY3MDAwMDAwMH0.test';
      tokenManager.setAccessToken(invalidExpToken);

      expect(tokenManager.isTokenExpired(invalidExpToken)).toBe(true);
      expect(tokenManager.isAuthenticated()).toBe(false);
    });
  });
});
