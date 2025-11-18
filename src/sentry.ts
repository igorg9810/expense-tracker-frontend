/**
 * Sentry Configuration
 *
 * Initializes Sentry for error tracking and performance monitoring
 */

import * as Sentry from '@sentry/react';

/**
 * Helper to safely get environment variables
 * Safe for Jest/testing environments
 */
const getEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] as string | undefined;
  }
  return undefined;
};

/**
 * Initialize Sentry with configuration
 * Only enabled in production or when explicitly enabled via environment variable
 */
export const initSentry = (): void => {
  const dsn = getEnv('VITE_SENTRY_DSN');
  const environment = getEnv('MODE') || 'development';
  const isEnabled = getEnv('VITE_SENTRY_ENABLED') === 'true' || environment === 'production';

  // Don't initialize Sentry in test environment or if disabled
  if (environment === 'test' || !isEnabled) {
    console.log('[Sentry] Disabled in', environment, 'environment');
    return;
  }

  if (!dsn) {
    console.warn('[Sentry] DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production (e.g., 0.1 for 10%)
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/[^/]*\.?yourapp\.com/],

    // Integrations for better error tracking
    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration({
        // Track navigation and routing changes
        enableInp: true,
      }),
      // Replay integration for session replay (helps debugging)
      Sentry.replayIntegration({
        // Mask all text and user input for privacy
        maskAllText: true,
        blockAllMedia: true,
      }),
      // HTTP client integration for tracking API calls
      Sentry.httpClientIntegration({
        // Don't capture API call bodies for privacy
        failedRequestStatusCodes: [[400, 599]],
      }),
    ],

    // Session Replay sample rate
    // This sets the sample rate at 10%. You may want to change it to 100% while in development
    // and then sample at a lower rate in production.
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Before sending events, filter out sensitive data
    beforeSend(event) {
      // Filter out development errors if needed
      if (environment === 'development') {
        console.log('[Sentry] Event captured:', event);
      }

      // Don't send events for certain errors
      if (event.exception) {
        const errorMessage = event.exception.values?.[0]?.value || '';

        // Filter out common non-critical errors
        if (
          errorMessage.includes('ResizeObserver loop') ||
          errorMessage.includes('Non-Error promise rejection')
        ) {
          return null;
        }
      }

      // Remove sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.category === 'console' && breadcrumb.data) {
            // Remove sensitive console logs
            delete breadcrumb.data.arguments;
          }
          return breadcrumb;
        });
      }

      return event;
    },

    // Don't send personal identifiable information
    sendDefaultPii: false,

    // Enable debug mode in development
    debug: environment === 'development',

    // Release version (should be set via build process)
    release: getEnv('VITE_APP_VERSION') || 'unknown',
  });

  console.log('[Sentry] Initialized successfully for environment:', environment);
};

/**
 * Set user context for error tracking
 * Call this after user login
 */
export const setSentryUser = (user: {
  id: number | string;
  email?: string;
  name?: string;
}): void => {
  Sentry.setUser({
    id: String(user.id),
    email: user.email,
    username: user.name,
  });
};

/**
 * Clear user context
 * Call this after user logout
 */
export const clearSentryUser = (): void => {
  Sentry.setUser(null);
};

/**
 * Add custom context to error reports
 */
export const addSentryContext = (key: string, data: Record<string, unknown>): void => {
  Sentry.setContext(key, data);
};

/**
 * Add breadcrumb for user action tracking
 */
export const addSentryBreadcrumb = (message: string, data?: Record<string, unknown>): void => {
  Sentry.addBreadcrumb({
    message,
    level: 'info',
    data,
    timestamp: Date.now() / 1000,
  });
};

/**
 * Manually capture an exception
 */
export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value as Record<string, unknown>);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

/**
 * Manually capture a message
 */
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): void => {
  Sentry.captureMessage(message, level);
};
