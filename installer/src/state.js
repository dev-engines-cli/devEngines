/**
 * @file Keeps track of data and application state.
 */

import { execSync } from 'node:child_process';
import {
  existsSync,
  readFileSync
} from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

/** @type {STATE} */
const state = {
  cwd: cwd(),
  homeDirectory: homedir(),
  dotDevEnginesPath: undefined,
  devEnginesCliManifestPath: undefined,
  manifestExists: false,
  existingVersion: undefined,
  gitInstalled: false
};

/**
 * Initializes the data in the global state object.
 *
 * @return {STATE} The initialized state object
 */
export const initializeState = function () {
  state.dotDevEnginesPath = join(state.homeDirectory, '.devEngines');
  state.devEnginesCliManifestPath = join(state.dotDevEnginesPath, 'package.json');

  try {
    state.manifestExists = existsSync(state.devEnginesCliManifestPath);
  } catch {
    /* v8 ignore next */
    logger('Error checking existence of local devEngines CLI');
  }

  if (state.manifestExists) {
    try {
      state.existingVersion = JSON.parse(readFileSync(state.devEnginesCliManifestPath)).version;
    } catch {
      /* v8 ignore next */
      logger('Error checking version of existing devEngines CLI');
    }
  }

  try {
    const gitVersion = String(execSync('git --version'));
    state.gitInstalled = gitVersion.startsWith('git version');
  } catch {
    /* v8 ignore next */
    logger('Could not find local git installation');
  }

  return state;
};
