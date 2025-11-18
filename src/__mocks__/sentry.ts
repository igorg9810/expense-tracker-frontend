/**
 * Mock for Sentry module in tests
 */

export const initSentry = jest.fn();
export const setSentryUser = jest.fn();
export const clearSentryUser = jest.fn();
export const addSentryContext = jest.fn();
export const addSentryBreadcrumb = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
