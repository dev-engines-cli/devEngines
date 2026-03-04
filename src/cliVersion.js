/**
 * @file Outputs the devEngines CLI version number.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const __dirname = import.meta.dirname;

/**
 * Returns the version number defined in the devEngines CLI package.json.
 *
 * @param  {boolean} forceThrow  Only used for test coverage
 * @return {string}              The version number or error message
 */
export const getCliVersion = function (forceThrow) {
  let version;
  try {
    // TODO: Remove when mock-fs working in tests
    if (forceThrow) {
      throw 'error';
    }
    const manifestPath = join(__dirname, '..', 'package.json');
    const manifestData = readFileSync(manifestPath);
    const manifest = JSON.parse(manifestData);
    version = 'v' + manifest.version;
  } catch {
    version = '[Error checking devEngines CLI version]';
  }
  return version;
};
