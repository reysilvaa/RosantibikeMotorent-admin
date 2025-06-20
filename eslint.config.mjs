import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base JS rules
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // TypeScript support
  tseslint.configs.recommended,

  // React support
  pluginReact.configs.flat.recommended,

  // Global rules (disable conflicting ones)
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // ❌ DISABLE this rule because Prettier handles it
      'react/jsx-sort-props': 'off'
    }
  },

  // Optional: TSX-specific rules
  {
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]);
