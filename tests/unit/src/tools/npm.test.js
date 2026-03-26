import { join } from 'node:path';

import axios from 'axios';
import { fs, vol } from 'memfs';

import { files, folders } from '@/pathMap.js';
import npm from '@/tools/npm.js';

import { LATEST_NPM } from '@@/data/constants.js';
import { error } from '@@/data/error.js';
import {
  makeCacheListFolder,
  makeCachedNpmReleases,
  mockNpmReleases
} from '@@/unit/testHelpers.js';

vi.mock('node:fs', () => {
  return fs;
});
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  };
});
const mockedAxiosGet = vi.mocked(axios.get);

describe('npm.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    makeCacheListFolder(vol);
  });

  describe('download', () => {
    const version = '11.0.0';

    test('Logs stub', () => {
      npm.download(version);

      expect(console.log)
        .toHaveBeenCalledWith('STUB: download');
    });

    test('Returns early if download not needed', () => {
      vol.mkdirSync(join(folders.npmInstalls, version), { recursive: true });

      npm.download(version);

      expect(console.log)
        .not.toHaveBeenCalled();
    });
  });

  describe('getLatestReleases', () => {
    test('Fetches once then uses cache', async () => {
      makeCachedNpmReleases(vol);
      const versions = mockNpmReleases(mockedAxiosGet);
      const run1 = await npm.getLatestReleases();
      const run2 = await npm.getLatestReleases();
      const cache = JSON.parse(fs.readFileSync(files.cachedNpmVersions, 'utf8'));

      expect(mockedAxiosGet)
        .toHaveBeenCalledTimes(1);

      expect(run1.data)
        .toEqual(versions);

      expect(run1)
        .toEqual(cache);

      expect(run1)
        .toEqual(run2);

      expect(console.log)
        .not.toHaveBeenCalled();
    });
  });

  describe('getCachedReleases', () => {
    test('Loads contents', () => {
      const contents = makeCachedNpmReleases(vol);

      expect(npm.getCachedReleases())
        .toEqual(contents);
    });
  });

  describe('isVersionInstalled', () => {
    const version = '11.0.0';

    test('Location does not exist', () => {
      expect(npm.isVersionInstalled(version))
        .toEqual(false);
    });

    test('Location does exist', () => {
      vol.mkdirSync(join(folders.npmInstalls, version), { recursive: true });

      expect(npm.isVersionInstalled(version))
        .toEqual(true);
    });
  });

  describe('resolveVersion', () => {
    test('Resolves semver exact versions', async () => {
      makeCachedNpmReleases(vol);
      const exact = '11.0.0';
      const result = await npm.resolveVersion(exact);

      expect(result)
        .toEqual(exact);
    });

    test('Resolves "latest"', async () => {
      makeCachedNpmReleases(vol);
      const resultLatest = await npm.resolveVersion('latest');

      expect(resultLatest)
        .toEqual(LATEST_NPM);
    });

    test('Resolves "lts"', async () => {
      makeCachedNpmReleases(vol);
      const resultLts = await npm.resolveVersion('lts');

      expect(resultLts)
        .toEqual(LATEST_NPM);
    });

    test('Resolves semver x-ranges', async () => {
      makeCachedNpmReleases(vol);
      const result = await npm.resolveVersion('9.x.x');

      expect(result)
        .toEqual('9.9.4');
    });

    test('Logs an error if version cannot be resolved', async () => {
      makeCachedNpmReleases(vol);
      const result = await npm.resolveVersion('9001.x.x');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });

    test('Logs an error if network call fails and cache is missing', async () => {
      mockedAxiosGet.mockRejectedValue(error);

      const result = await npm.resolveVersion('latest');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });

    test('Logs an error if version is invalid', async () => {
      makeCachedNpmReleases(vol);
      const result = await npm.resolveVersion('asdf');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });
  });
});
