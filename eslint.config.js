/* eslint-disable import/no-extraneous-dependencies */

/**
 * @file ESLint config
 */

import path from 'node:path';

import pluginJs from '@eslint/js';
import tjwBase from 'eslint-config-tjw-base';
import tjwImport from 'eslint-config-tjw-import';
import tjwJest from 'eslint-config-tjw-jest';
import tjwJsdoc from 'eslint-config-tjw-jsdoc';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';

const __dirname = import.meta.dirname;

const config = [
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginJest.configs['flat/recommended'],
  tjwBase.configs.recommended,
  tjwImport,
  ...tjwJsdoc,
  tjwJest.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2026,
      globals: {
        Bun: true,
        vi: true
      }
    },
    // project specific rules/settings
    rules: {
      // If this is not turned off, linting throws because it can't find 'jest' install
      'jest/no-deprecated-functions': 'off'
    },
    settings: {
      'import/resolver': {
        vite: {
          viteConfig: {
            resolve: {
              alias: {
                '@': path.resolve(__dirname, 'src'),
                '@@': path.resolve(__dirname, 'tests'),
                '@@@': path.resolve(__dirname, 'docs')
              }
            }
          }
        }
      }
    }
  },
  {
    files: [
      './tests/**/*'
    ],
    rules: {
      'jsdoc/require-file-overview': 'off'
    }
  }
];

/* eslint-disable-next-line import/no-unused-modules */
export default config;
