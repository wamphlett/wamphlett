import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettierConfig from './.prettierrc.js';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-console': 'warn',
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-floating-decimal': 'error',
      'no-sequences': 'error',
      'array-bracket-spacing': 'error',
      'computed-property-spacing': ['error', 'never'],
      curly: 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'one-var-declaration-per-line': 'error',
      quotes: [
        'error',
        'single',
        { allowTemplateLiterals: false, avoidEscape: true },
      ],
      'prefer-const': 'error',
      'sort-imports': [
        'error',
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
      'react/jsx-sort-props': ['error', { ignoreCase: true }],
      'react-hooks/exhaustive-deps': 'off',
      'prettier/prettier': ['error', prettierConfig],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
