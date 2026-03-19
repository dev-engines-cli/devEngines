/**
 * @file Outputs the devEngines CLI version number.
 */

import { readFileSync } from 'node:fs';

import { files } from './pathMap.js';

/**
 * Returns the version number defined in the devEngines CLI package.json.
 *
 * @return {string} The version number or error message
 */
export const getCliVersion = function () {
  let version;
  try {
    const manifestData = readFileSync(files.projectManifest);
    const manifest = JSON.parse(manifestData);
    version = 'v' + manifest.version;
  } catch {
    version = '[Error checking devEngines CLI version]';
  }
  return version;
};
