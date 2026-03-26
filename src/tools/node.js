/**
 * @file Handles getting the list of Node releases, caching it, and
 *       resolve a given Node version to an exact version.
 */

import {
  existsSync,
  writeFileSync
} from 'node:fs';
import {
  arch,
  platform
} from 'node:os';
import {
  dirname,
  join
} from 'node:path';

import axios from 'axios';
import {
  rcompare,
  satisfies,
  valid,
  validRange
} from 'semver';

import {
  API_COOL_DOWN,
  ensureFolderExists,
  loadJsonFile
} from '../helpers.js';
import { files, folders } from '../pathMap.js';

/**
 * @typedef  {object}   NODERELEASE
 * @property {string}   version      The Node.js version ('25.6.1')
 * @property {string}   date         Node release publish date ('2026-02-09')
 * @property {string[]} files        Names of the published files for this Node release
 * @property {string}   npm          The npm version shipped with this Node release
 * @property {boolean}  lts          If this was a Long Term Support (LTS) release
 */

/**
 * @typedef  {object}        NODERELEASES
 * @property {number}        date          The timestamp of when the data was last cached
 * @property {NODERELEASE[]} data          Array of Node.js release objects
 */

/**
 * Reads/Parses/returns the nodeVersions.json file.
 *
 * @return {NODERELEASES} List of node releases with timestamp
 */
const getCachedReleases = function () {
  ensureFolderExists(dirname(files.cachedNodeVersions));
  return loadJsonFile(files.cachedNodeVersions);
};

/**
 * Loads the cached nodeVersions.json file, checks if it was cached in the
 * last 10 seconds and if so, returns it. Otherwise downloads the latest
 * version and updates the nodeVersions.json cache.
 *
 * @return {Promise<NODERELEASES>} List of node releases (or undefined) and a timestamp
 */
const getLatestReleases = async function () {
  let cache = getCachedReleases();
  let contents = cache;
  if (cache?.data?.length) {
    const timeStamp = cache.date;
    const now = (new Date()).getTime();
    if (now - timeStamp < API_COOL_DOWN) {
      return cache;
    }
  }
  try {
    const nodeVersionsUrl = 'https://nodejs.org/download/release/index.json';
    const response = await axios.get(nodeVersionsUrl);
    const data = response.data.map((release) => {
      return {
        version: release.version.replace('v', ''),
        date: release.date,
        files: release.files,
        npm: release.npm,
        lts: release.lts
      };
    });
    contents = {
      date: (new Date()).getTime(),
      data
    };
    const fileContents = JSON.stringify(contents, null, 2) + '\n';
    writeFileSync(files.cachedNodeVersions, fileContents);
  } catch (error) {
    console.log('Error checking for latest Node releases');
    console.log(error);
  }
  return contents;
};

/**
 * Finds an exact version number based on the desired version passed in.
 *
 * @param  {string}                    version  A version (`22`, `>=24.0.0`, `lts`, etc)
 * @return {Promise<string|undefined>}          An exact version number (`24.1.0`)
 */
const resolveVersion = async function (version) {
  const nodeReleases = await getLatestReleases();
  const nodeVersions = nodeReleases?.data?.map((release) => {
    return release.version;
  }).sort(rcompare);

  if (
    version === 'latest' &&
    nodeVersions[0]
  ) {
    return nodeVersions[0];
  }

  if (version === 'lts') {
    return nodeReleases?.data?.find((release) => {
      return release.lts;
    }).version;
  }

  if (
    // Anything other than an exact version returns null
    valid(version) &&
    nodeVersions.includes(version)
  ) {
    return version;
  }

  if (validRange(version)) {
    const latestInRange = nodeReleases?.data?.find((release) => {
      return satisfies(release.version, version);
    });
    if (latestInRange?.version) {
      return latestInRange.version;
    }
  }

  console.log('Desired Node version cannot be found.');
  return undefined;
};

/**
 * Check if a given version is already downloaded.
 *
 * @param  {string}  version  Node version to check for
 * @return {boolean}          true = exists
 */
const isVersionInstalled = function (version) {
  let exists = false;
  try {
    // TODO: Add in a more comprehensive check
    exists = existsSync(join(folders.nodeInstalls, version));
  } catch {
    /* v8 ignore next */
    console.log('Error checking Node install path');
  }
  return exists;
};

/**
 * Creates the Node.js download URL based on the OS, Arch, and Node version.
 *
 * @example
 * https://nodejs.org/dist/v25.0.0/node-v25.0.0-darwin-arm64.tar.gz
 * https://nodejs.org/dist/v25.0.0/node-v25.0.0-linux-x64.tar.gz
 * https://nodejs.org/dist/v25.0.0/node-v25.0.0-win-x64.zip
 *
 * @param  {string} version  The exact resolved version of Node to download
 * @return {string}          The URL to download that version of Node for the current OS
 */
export const createNodeDownloadUrl = function (version) {
  let osForUrl = platform();
  let extension = 'tar.gz';

  if (osForUrl === 'win32') {
    osForUrl = 'win';
    extension = 'zip';
  }
  const fileName = [
    'node',
    'v' + version,
    osForUrl,
    arch()
  ].join('-');
  const file = fileName + '.' + extension;

  const url = [
    'https://nodejs.org',
    'dist',
    'v' + version,
    file
  ].join('/');

  return url;
};

/**
 * TODO: Download Node version.
 *
 * @param {string} version  Node version to download
 */
const download = function (version) {
  if (isVersionInstalled(version)) {
    return;
  }

  // const url = createNodeDownloadUrl(version);

  console.log('STUB: download');
};

export default {
  download,
  isVersionInstalled,
  getCachedReleases,
  getLatestReleases,
  resolveVersion
};
