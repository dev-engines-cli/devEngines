/**
 * @file Interactions with the /globalTools.json file.
 */

import {
  existsSync,
  readFileSync
} from 'node:fs';
import { join } from 'node:path';

import { supportedTools } from './helpers.js';

const __dirname = import.meta.dirname;

/**
 * @typedef  {object} GLOBALTOOLS
 * @property {string} [bun]        The global Bun version, if set
 * @property {string} [deno]       The global Deno version, if set
 * @property {string} [node]       The global Node version, if set
 * @property {string} [npm]        The global npm version, if set
 * @property {string} [pnpm]       The global PNPM version, if set
 * @property {string} [yarn]       The global Yarn version, if set
 */

/**
 * Returns the global tool version user settings, if possible.
 *
 * @return {GLOBALTOOLS} The user's global versions for tools.
 */
export const getGlobalToolVersions = function () {
  const globalToolsPath = join(__dirname, '..', 'globalTools.json');
  let globalToolsExist = false;
  try {
    globalToolsExist = existsSync(globalToolsPath);
  } catch {
    // do nothing
  }
  let globalToolsFileData;
  if (globalToolsExist) {
    try {
      globalToolsFileData = String(readFileSync(globalToolsPath));
      globalToolsFileData = JSON.parse(globalToolsFileData);
    } catch {
      // do nothing
    }
  }
  let globalTools = {};
  for (const tool of supportedTools) {
    globalTools[tool] = '';
  }

  if (
    globalToolsFileData &&
    typeof(globalToolsFileData) === 'object'
  ) {
    for (const tool of supportedTools) {
      if (globalToolsFileData[tool]) {
        globalTools[tool] = globalToolsFileData[tool];
      }
    }
  }
  return globalTools;
};
