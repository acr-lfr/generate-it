import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['build/**', 'node_modules/**', 'test_server/**', 'test_server_client/**', 'test_asyncapi/**', 'docs/**', '**/*.js', '**/*.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // This codebase predates strict typing in its spec-handling core.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-var': 'error',
      'prefer-const': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-trailing-spaces': 'error',
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
      'max-len': ['error', { code: 240, ignorePattern: '^import |^export \\{' }],
      // The build targets ES5, which has no Error `cause` option to attach caught errors to.
      'preserve-caught-error': 'off',
    },
  }
);
