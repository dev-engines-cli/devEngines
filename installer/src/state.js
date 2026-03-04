/**
 * @file Keeps track of data and application state.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

/** @type {STATE} */
const state = {
  homeDirectory: undefined,
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
export const initializeState = async function () {
  state.homeDirectory = os.homedir();
  state.dotDevEnginesPath = path.join(state.homeDirectory, '.devEngines');
  state.devEnginesCliManifestPath = path.join(state.dotDevEnginesPath, 'package.json');

  try {
    state.manifestExists = fs.existsSync(state.devEnginesCliManifestPath);
  } catch {
    logger('Error checking existence of local devEngines CLI');
  }

  if (state.manifestExists) {
    try {
      state.existingVersion = JSON.parse(fs.readFileSync(state.devEnginesCliManifestPath)).version;
    } catch {
      logger('Error checking version of existing devEngines CLI');
    }
  }

  try {
    const gitVersion = String(execSync('git --version'));
    state.gitInstalled = gitVersion.startsWith('git version');
  } catch {
    logger('Could not find local git installation');
  }

  return state;
};
