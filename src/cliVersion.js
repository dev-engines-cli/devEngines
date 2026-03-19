/**
 * @file Outputs the devEngines CLI version number.
 */

import { existsSync, readFileSync } from 'node:fs';

import { files } from './pathMap.js';

/**
 * Returns the version number defined in the devEngines CLI package.json.
 *
 * @return {string} The version number or error message
 */
export const getCliVersion = function () {
  let version = '[Error checking devEngines CLI version]';
  try {
    if (existsSync(files.projectManifest)) {
      const manifestData = readFileSync(files.projectManifest);
      const manifest = JSON.parse(manifestData);
      version = 'v' + manifest.version;
    }
  } catch {
    //
  }
  return version;
};
