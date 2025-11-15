// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  [
    { ignores: ['dist'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files: ['**/*.{js,ts,tsx}'],
      plugins: {
        react,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        prettier,
      },
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...react.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,
        'prettier/prettier': 'warn',
        'react/react-in-jsx-scope': 'off', // Not needed for React 17+
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      },
    },
    // Configuration for CommonJS files (Jest mocks)
    {
      files: ['**/__mocks__/**/*.js', 'jest.config.js'],
      languageOptions: {
        globals: globals.node,
        sourceType: 'commonjs',
      },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'no-undef': 'off',
      },
    },
    eslintConfigPrettier,
  ],
  storybook.configs['flat/recommended'],
);
