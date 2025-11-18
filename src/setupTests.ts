// Jest setup file
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock Sentry module before any other imports
jest.mock('./sentry', () => ({
  initSentry: jest.fn(),
  setSentryUser: jest.fn(),
  clearSentryUser: jest.fn(),
  addSentryContext: jest.fn(),
  addSentryBreadcrumb: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

// Polyfill for TextEncoder/TextDecoder (needed for React Router)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as never;
  global.TextDecoder = TextDecoder as never;
}

// Mock ResizeObserver if needed
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver if needed
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock import.meta for Jest compatibility with Vite
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import = globalThis.import || {};
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta = globalThis.import.meta || {};
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta.env = globalThis.import.meta.env || {};
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta.env.VITE_API_BASE_URL = 'http://localhost:3000';
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta.env.MODE = 'test';
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta.env.DEV = false;
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta.env.PROD = false;
// @ts-expect-error - Mocking import.meta for Jest
globalThis.import.meta.env.SSR = false;

// Suppress console methods during tests to prevent React warnings from failing CI
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Filter out known React warnings that are expected in tests
    const message = args[0]?.toString() || '';
    if (
      message.includes('Not wrapped in act(...)') ||
      message.includes('controlled input') ||
      message.includes('uncontrolled input') ||
      message.includes('vendor-prefixed property') ||
      message.includes('<tr> cannot be a child of <div>') ||
      message.includes('hydration error') ||
      message.includes('without an `onChange` handler')
    ) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args: unknown[]) => {
    // Filter out known warnings
    const message = args[0]?.toString() || '';
    if (message.includes('componentWillReceiveProps') || message.includes('componentWillMount')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
