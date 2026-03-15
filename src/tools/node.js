/**
 * @file Handles getting the list of Node releases, caching it, and
 *       resolve a given Node version to an exact version.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import axios from 'axios';
import {
  satisfies,
  valid,
  validRange
} from 'semver';

import {
  API_COOL_DOWN,
  loadJsonFile
} from '../helpers.js';

const __dirname = import.meta.dirname;

const nodeVersionsPath = join(__dirname, '..', '..', 'cacheLists', 'nodeVersions.json');

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
  return loadJsonFile(nodeVersionsPath);
};

/**
 * Loads the cached nodeVersions.json file, checks if it was cached in the
 * last 10 seconds and if so, returns it. Otherwise downloads the latest
 * version and updates the nodeVersions.json cache.
 *
 * @return {Promise<NODERELEASES>} List of node releases (or undefined) and a timestamp
 */
const getLatestReleases = async function () {
  const nodeVersionsUrl = 'https://nodejs.org/download/release/index.json';
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
    if (data.length > (cache?.data?.length || 0)) {
      contents = {
        date: (new Date()).getTime(),
        data
      };
      const fileContents = JSON.stringify(contents, null, 2) + '\n';
      writeFileSync(nodeVersionsPath, fileContents);
    }
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
  });

  if (version === 'latest') {
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

export default {
  getCachedReleases,
  getLatestReleases,
  resolveVersion
};
