import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Ignore generated/dist folders globally
  globalIgnores(['dist', 'node_modules']),

  {
    // Lint all TypeScript and TSX files in src
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: ['src/components/ui/**'], // optional: ignore UI components

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'module',
    },
  },
]);
