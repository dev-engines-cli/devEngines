/**
 * @file Interactions with the /globalTools.json file.
 */

import {
  existsSync,
  readFileSync,
  writeFileSync
} from 'node:fs';

import {
  getToolTitleCase,
  supportedTools
} from './helpers.js';
import { files } from './pathMap.js';

/** @typedef {import('./types.js').TOOL} TOOL */

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
  let globalToolsExist = false;
  try {
    globalToolsExist = existsSync(files.globalTools);
  } catch {
    // do nothing
  }
  let globalToolsFileData;
  if (globalToolsExist) {
    try {
      globalToolsFileData = String(readFileSync(files.globalTools));
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

/**
 * Updates a tool's version number in the globalTools.json.
 *
 * @param {TOOL}   tool     The tool name to set
 * @param {string} version  The resolved version number
 */
export const setGlobalToolVersion = function (tool, version) {
  const globalTools = getGlobalToolVersions();
  if (Object.keys(globalTools).includes(tool)) {
    globalTools[tool] = version;
    const data = JSON.stringify(globalTools, null, 2) + '\n';
    const title = getToolTitleCase(tool);
    try {
      writeFileSync(files.globalTools, data);
      console.log('Successfully updated global ' + title + ' version to ' + version);
    } catch (error) {
      console.log('Error setting ' + title + ' to ' + version + ' in:\n' + files.globalTools);
      console.log(error);
    }
  }
};
