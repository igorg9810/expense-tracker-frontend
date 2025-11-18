export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Handle SVG imports
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.svg\\?react$': '<rootDir>/__mocks__/svgMock.js',

    // Handle other static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',

    // Mock Sentry module
    '^@/sentry$': '<rootDir>/src/__mocks__/sentry.ts',
    '^\\.\\.?/sentry$': '<rootDir>/src/__mocks__/sentry.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_BASE_URL: 'http://localhost:3000',
                    MODE: 'test',
                    DEV: false,
                    PROD: false,
                    SSR: false,
                    VITE_SENTRY_DSN: '',
                    VITE_SENTRY_ENABLED: 'false',
                    VITE_APP_VERSION: 'test',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3000',
        MODE: 'test',
        DEV: false,
        PROD: false,
        SSR: false,
      },
    },
    'ts-jest': {
      isolatedModules: true,
    },
    __DEV__: true,
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
};
