/**
 * @file Helper functions regarding package.json files.
 */

import {
  existsSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

import {
  determineEndOfLineCharacter,
  determineIndentation,
  supportedRuntimes,
  supportedPackageManagers,
  supportedTools
} from './helpers.js';

// TODO: Because monorepos, we should verify the devEgnins field exists
//       in the found manifest, and if not, continue looking.
/**
 * Recursively looks for the package.json file in the current directory
 * and each parent directory until it finds it, hits the system root,
 * or reaches a max retry amount.
 *
 * @param  {string}           cwd      File path to look for the package.json in
 * @param  {number}           attempt  The current retry we are on
 * @return {string|undefined}          The file path to the package.json if found
 */
export const findManifest = function (cwd, attempt) {
  cwd = cwd || process.cwd();
  if (typeof(attempt) !== 'number') {
    attempt = 20;
  }

  let potentialManifestPath = join(cwd, 'package.json');

  let manifestExists = false;
  try {
    manifestExists = existsSync(potentialManifestPath);
  } catch {
    // do nothing
  }
  if (manifestExists) {
    return potentialManifestPath;
  }

  let newCwd = join(cwd, '..');
  if (
    cwd === newCwd ||
    attempt === 0
  ) {
    return undefined;
  }
  return findManifest(newCwd, attempt - 1);
};

/**
 * @typedef  {object}           MANIFESTDATA
 * @property {'\n'|'\r'|'\r\n'} eol           The end of line delimeter
 * @property {number|'\t'}      indentation   The indentation type used
 * @property {object}           manifest      The parsed version of package.json
 * @property {string}           manifestPath  The absolute file location
 */

/**
 * Finds, parses, and returns the closest package.json
 * to the current working directory, along with the eol
 * and indentation found in the file.
 *
 * @return {MANIFESTDATA} The package.json as an object
 */
export const getManifestData = function () {
  const manifestPath = findManifest();
  const data = {
    eol: undefined,
    indentation: undefined,
    manifest: undefined,
    manifestPath
  };
  if (!manifestPath) {
    return data;
  }
  try {
    let manifestData = String(readFileSync(manifestPath));
    data.eol = determineEndOfLineCharacter(manifestData);
    data.indentation = determineIndentation(manifestData);
    data.manifest = JSON.parse(manifestData);
  } catch {
    // do nothing
  }
  return data;
};

/* TODO: Bun can be in the runtime or packageManager section,
 *       so theoretically they could have different numbers.
 *       This should not be allowed, as a regular install of
 *       bun would use the same version for both, and may
 *       even have runtime code that expects the packageManager
 *       side of bun to have specific API's or vice versa.
 *       If bun is in both places, we should always force the
 *       packageManager version to match the runtime.
 */
/* TODO: The runtime and packageManager fields can be an array
 *       of objects, including duplicate values. We should
 *       remove the duplicates when setting the devEngines
 *       fields.
 */

/**
 * @typedef  {object} RAWVERSIONS
 * @property {string} [node]       The raw Node.js version
 * @property {string} [deno]       The raw Deno version
 * @property {string} [bun]        The raw Bun version
 * @property {string} [npm]        The raw npm version
 * @property {string} [pnpm]       The raw pnpm version
 * @property {string} [yarn]       The raw Yarn version
 */

/**
 * Returns the tool versions as defined in the devEngines,
 * to be validated and resolved later.
 *
 * @return {RAWVERSIONS} Simplified object of raw tool versions.
 */
export const getRawToolVersions = function () {
  const { manifest } = getManifestData();
  let versions = {};
  function setVersionFromDevEngines (type) {
    if (
      manifest?.devEngines &&
      manifest.devEngines[type]
    ) {
      if (Array.isArray(manifest.devEngines[type])) {
        manifest.devEngines[type].forEach((tool) => {
          if (tool?.name && tool?.version) {
            versions[tool.name.toLowerCase()] = tool.version;
          }
        });
      } else if (
        manifest.devEngines[type].name &&
        manifest.devEngines[type].version
      ) {
        versions[manifest.devEngines[type].name.toLowerCase()] = manifest.devEngines[type].version;
      }
    }
  }
  setVersionFromDevEngines('runtime');
  setVersionFromDevEngines('packageManager');
  return versions;
};

/** @typedef {'runtime'|'packageManager'} SUBSECTION */
/** @typedef {'node'|'npm'|'bun'|'deno'|'pnpm'|'yarn'} TOOLNAME*/

/**
 * Sets the tool version in the manifest.
 *
 * @param {object}     manifest    The user's parsed package.json.
 * @param {SUBSECTION} subSection  The sub-section to set in the devEngines
 * @param {TOOLNAME}   name        The desired tool to pin in devEngines
 * @param {string}     version     The desired version to pin in devEngines
 */
export const mutateManifest = function (manifest, subSection, name, version) {
  manifest.devEngines = manifest.devEngines || {};
  manifest.devEngines[subSection] = manifest.devEngines[subSection] || {};
  if (Array.isArray(manifest.devEngines[subSection])) {
    const existingIndex = manifest.devEngines[subSection].findIndex((tool) => {
      return tool.name === name;
    });
    if (existingIndex > -1) {
      manifest.devEngines[subSection][existingIndex].version = version;
    } else {
      manifest.devEngines[subSection].push({ name, version });
    }
  } else if (
    manifest.devEngines[subSection].name?.length &&
    manifest.devEngines[subSection].name !== name
  ) {
    manifest.devEngines[subSection] = [
      manifest.devEngines[subSection],
      { name, version }
    ];
  } else {
    manifest.devEngines[subSection] = { name, version };
  }
};

/**
 * Reads in the user's package.json, pins the desired tool version in the
 * correct sub-section. Handles existing object or arrays.
 *
 * @param {SUBSECTION} subSection  The sub-section to set in the devEngines
 * @param {TOOLNAME}   name        The desired tool to pin in devEngines
 * @param {string}     version     The desired version to pin in devEngines
 */
const setDevEnginesSubSection = function (subSection, name, version) {
  const {
    eol,
    indentation,
    manifest,
    manifestPath
  } = getManifestData();
  if (!manifestPath || !manifest) {
    console.log(
      'Could not set ' + name + '@' + version +
      ' in package.json:devEngines:' + subSection + '.'
    );
    return;
  }
  mutateManifest(manifest, subSection, name, version);
  let mutatedManifest = JSON.stringify(manifest, null, indentation) + '\n';
  mutatedManifest = mutatedManifest.replaceAll('\n', eol);
  writeFileSync(manifestPath, mutatedManifest);
};

/**
 * Sets a value in the devEngines field in the user's package.json.
 *
 * @param {TOOLNAME} tool     The desired tool to pin in devEngines
 * @param {string}   version  The desired version to pin in devEngines
 */
export const setToolInDevEngines = function (tool, version) {
  // Because 'bun' can appear in both, they are non-exclusionary
  if (supportedRuntimes.includes(tool)) {
    setDevEnginesSubSection('runtime', tool, version);
  }
  if (supportedPackageManagers.includes(tool)) {
    setDevEnginesSubSection('packageManager', tool, version);
  }
  if (!supportedTools.includes(tool)) {
    console.log('Your version of devEngines CLI does not support "' + tool + '".');
  }
};
