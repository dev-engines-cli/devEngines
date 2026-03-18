import { dirname } from 'node:path';

import axios from 'axios';
import { fs, vol } from 'memfs';

import { files } from '@/pathMap.js';
import npm from '@/tools/npm.js';

import { error } from '@@/data/error.js';

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

const cachePath = files.cachedNpmVersions;

describe('npm.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    vol.mkdirSync(dirname(cachePath), { recursive: true });
  });

  describe('getLatestReleases', () => {
    test('Fetches once then uses cache', async () => {
      const data = {
        versions: {
          '1.1.0': {},
          '1.0.0': {}
        }
      };
      const versions = Object.keys(data.versions);
      mockedAxiosGet.mockResolvedValue({ data });

      const run1 = await npm.getLatestReleases();
      const run2 = await npm.getLatestReleases();
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

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
      const contents = {
        date: Date.now(),
        data: ['1.0.0']
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      expect(npm.getCachedReleases())
        .toEqual(contents);
    });
  });

  describe('resolveVersion', () => {
    test('Resolves semver exact versions', async () => {
      const exact = '11.0.0';
      const contents = {
        date: Date.now(),
        data: [exact]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await npm.resolveVersion(exact);

      expect(result)
        .toEqual(exact);
    });

    test('Resolves "latest" and "lts"', async () => {
      const latest = '11.11.0';
      const contents = {
        date: Date.now(),
        data: [latest, '11.0.0']
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const resultLatest = await npm.resolveVersion('latest');
      const resultLts = await npm.resolveVersion('lts');

      expect(resultLatest)
        .toEqual(latest);

      expect(resultLts)
        .toEqual(latest);
    });

    test('Resolves semver x-ranges', async () => {
      const expected = '9.9.4';
      const contents = {
        date: Date.now(),
        data: [
          '10.0.0',
          expected,
          '9.0.0',
          '8.0.0'
        ]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await npm.resolveVersion('9.x.x');

      expect(result)
        .toEqual(expected);
    });

    test('Logs an error if version cannot be resolved', async () => {
      const contents = {
        date: Date.now(),
        data: []
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

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
      const contents = {
        date: Date.now(),
        data: []
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await npm.resolveVersion('asdf');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });
  });
});
