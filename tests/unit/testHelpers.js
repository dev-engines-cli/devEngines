/**
 * @file Reusable helpers for unit tests.
 */

import { dirname } from 'node:path';

import { rcompare } from 'semver';

import { files } from '@/pathMap.js';

import {
  CLI_VERSION,
  nodeReleasesDummyData,
  npmReleasesDummyData
} from '@@/data/constants.js';

/**
 * Creates the cacheLists folder in memfs.
 *
 * @param {object} vol  memfs vol instance
 */
export const makeCacheListFolder = function (vol) {
  vol.mkdirSync(dirname(files.cachedNodeVersions), { recursive: true });
};

/**
 * Creates a Node version cache file with dummy data.
 *
 * @param  {object} vol  memfs vol instance
 * @return {object}      The dummy data
 */
export const makeCachedNodeReleases = function (vol) {
  const contents = JSON.stringify(nodeReleasesDummyData, null, 2) + '\n';
  vol.writeFileSync(files.cachedNodeVersions, contents);
  return nodeReleasesDummyData;
};

/**
 * Creates a npm version cache file with dummy data.
 *
 * @param  {object} vol  memfs vol instance
 * @return {object}      The dummy data
 */
export const makeCachedNpmReleases = function (vol) {
  const contents = JSON.stringify(npmReleasesDummyData, null, 2) + '\n';
  vol.writeFileSync(files.cachedNpmVersions, contents);
  return npmReleasesDummyData;
};

/**
 * Creates a mock globalTools.json file.
 *
 * @param  {object} vol  memfs vol instance
 * @return {object}      globalTools dummy data
 */
export const makeGlobalToolsDummyData = function (vol) {
  const globalToolsDummyData = Object.freeze({
    node: '25.0.0',
    npm: '11.0.0'
  });
  const content = JSON.stringify(globalToolsDummyData, null, 2) + '\n';
  vol.mkdirSync(dirname(files.globalTools), { recursive: true });
  vol.writeFileSync(files.globalTools, content);
  return globalToolsDummyData;
};

/**
 * Creates a mock package.json file.
 *
 * @param {object} vol  memfs vol instance
 */
export const makeProjectManifest = function (vol) {
  const data = {
    name: 'DummyManifest',
    version: CLI_VERSION.replace('v', '')
  };
  const contents = JSON.stringify(data, null, 2) + '\n';
  vol.mkdirSync(dirname(files.projectManifest), { recursive: true });
  vol.writeFileSync(files.projectManifest, contents);
};

/**
 * Mocks out the network call to get Node releases.
 *
 * @param  {object}   mockedAxiosGet  The mocked axios.get
 * @return {object[]}                 Arry of release objects containing version key
 */
export const mockNodeReleases = function (mockedAxiosGet) {
  mockedAxiosGet.mockResolvedValue({
    data: nodeReleasesDummyData.data.map((release) => ({
      ...release,
      version: 'v' + release.version
    }))
  });
  return nodeReleasesDummyData.data;
};

/**
 * Mocks out the network call to get npm releases.
 *
 * @param  {object}   mockedAxiosGet  The mocked axios.get
 * @return {string[]}                 Array of version numbers
 */
export const mockNpmReleases = function (mockedAxiosGet) {
  const data = {
    versions: {}
  };

  for (const version of npmReleasesDummyData.data) {
    data.versions[version] = {};
  }

  mockedAxiosGet.mockResolvedValue({ data });
  return npmReleasesDummyData.data.toSorted(rcompare);
};
