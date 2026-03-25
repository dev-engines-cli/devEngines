/**
 * @file Handles getting the list of npm releases, caching it, and
 *       resolve a given npm version to an exact version.
 */

import { writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

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
import { files } from '../pathMap.js';

/**
 * @typedef  {object}   NPMRELEASES
 * @property {number}   date         The timestamp of when the data was last cached
 * @property {string[]} data         Array of npm version numbers
 */

/**
 * Reads/Parses/returns the nodeVersions.json file.
 *
 * @return {NPMRELEASES} List of npm versions with timestamp
 */
const getCachedReleases = function () {
  ensureFolderExists(dirname(files.cachedNpmVersions));
  return loadJsonFile(files.cachedNpmVersions);
};

/**
 * Loads the cached nodeVersions.json file, checks if it was cached in the
 * last 10 seconds and if so, returns it. Otherwise downloads the latest
 * version and updates the nodeVersions.json cache.
 *
 * @return {Promise<NPMRELEASES>} List of npm versions and a timestamp
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
    // TODO: May also need URL that returns release download file names
    const npmVersionsUrl = 'https://registry.npmjs.org/npm';
    const response = await axios.get(npmVersionsUrl, {
      headers: {
        // accept header is used to send an abbreviated document instead of the full one
        // results in a ~90% reduction in response size
        // see: https://github.com/npm/registry/blob/ae49abf/docs/responses/package-metadata.md
        Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8'
      }
    });
    // TODO: Properly parse response data to ensure the data is what we expect
    const versions = Object
      .keys(response.data.versions)
      .sort(rcompare);

    contents = {
      date: (new Date()).getTime(),
      data: versions
    };
    const fileContents = JSON.stringify(contents, null, 2) + '\n';
    writeFileSync(files.cachedNpmVersions, fileContents);
  } catch (error) {
    console.log('Error checking for latest npm releases');
    console.log(error);
  }
  return contents;
};

/**
 * Finds an exact version number based on the desired version passed in.
 *
 * @param  {string}                    desiredVersion  A version (`9`, `>=9.0.0`, `lts`, etc)
 * @return {Promise<string|undefined>}                 An exact version number (`9.9.4`)
 */
const resolveVersion = async function (desiredVersion) {
  const npmReleases = await getLatestReleases();
  const npmVersions = npmReleases?.data || [];

  if (
    desiredVersion === 'latest' &&
    npmVersions[0]
  ) {
    return npmVersions[0];
  }

  if (desiredVersion === 'lts') {
    return npmVersions.filter((desiredVersion) => {
      return !desiredVersion.includes('-');
    })[0];
  }

  if (
    // Anything other than an exact version returns null
    valid(desiredVersion) &&
    npmVersions.includes(desiredVersion)
  ) {
    return desiredVersion;
  }

  if (validRange(desiredVersion)) {
    const latestInRange = npmVersions.find((officialVersion) => {
      return satisfies(officialVersion, desiredVersion);
    });
    if (latestInRange) {
      return latestInRange;
    }
  }

  console.log('Desired npm version cannot be found.');
  return undefined;
};

export default {
  getCachedReleases,
  getLatestReleases,
  resolveVersion
};
