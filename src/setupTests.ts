// Jest setup file
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

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
