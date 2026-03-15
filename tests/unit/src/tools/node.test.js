import { dirname, join } from 'node:path';

import axios from 'axios';
import { fs, vol } from 'memfs';

import node from '@/tools/node.js';

import { error } from '@@/data/error.js';

vi.mock('node:fs', () => fs);
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));
const mockedAxiosGet = vi.mocked(axios.get);

const __dirname = import.meta.dirname;
const cachePath = join(__dirname, '..', '..', '..', '..', 'cacheLists', 'nodeVersions.json');

describe('node.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    vol.mkdirSync(dirname(cachePath), { recursive: true });
  });

  describe('getLatestReleases', () => {
    test('Network call fails', async () => {
      const contents = {
        date: Date.now(),
        data: []
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      mockedAxiosGet.mockRejectedValue(error);

      const releases = await node.getLatestReleases();

      expect(mockedAxiosGet)
        .toHaveBeenCalledTimes(1);

      expect(releases)
        .toEqual(contents);

      expect(console.log)
        .toHaveBeenCalledWith('Error checking for latest Node releases');

      expect(console.log)
        .toHaveBeenCalledWith(error);
    });

    test('Fetches once then uses cache', async () => {
      const releases = [
        { version: '1.0.0' },
        { version: '1.1.0' }
      ];
      mockedAxiosGet.mockResolvedValue({
        data: releases.map((release) => ({
          ...release,
          version: 'v' + release.version
        }))
      });

      const run1 = await node.getLatestReleases();
      const run2 = await node.getLatestReleases();
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

      expect(mockedAxiosGet)
        .toHaveBeenCalledTimes(1);

      expect(run1.data)
        .toEqual(releases);

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
        data: [
          { version: '1.0.0' }
        ]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      expect(node.getCachedReleases())
        .toEqual(contents);
    });
  });

  describe('resolveVersion', () => {
    test('Resolves semver exact versions', async () => {
      const exact = '22.0.0';
      const contents = {
        date: Date.now(),
        data: [
          { version: exact }
        ]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await node.resolveVersion(exact);

      expect(result)
        .toEqual(exact);
    });

    test('Resolves "latest"', async () => {
      const latest = '25.8.0';
      const contents = {
        date: Date.now(),
        data: [
          { version: latest },
          { version: '25.7.0' }
        ]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await node.resolveVersion('latest');

      expect(result)
        .toEqual(latest);
    });

    test('Resolves "lts"', async () => {
      const lts = '24.14.0';
      const contents = {
        date: Date.now(),
        data: [
          { version: '25.8.1' },
          { version: lts, lts: 'Krypton' }
        ]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await node.resolveVersion('lts');

      expect(result)
        .toEqual(lts);
    });

    test('Resolves semver x-ranges', async () => {
      const latest = '25.8.0';
      const contents = {
        date: Date.now(),
        data: [
          { version: latest },
          { version: '25.7.0' }
        ]
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await node.resolveVersion('25.x.x');

      expect(result)
        .toEqual(latest);
    });

    test('Logs an error if version cannot be resolved', async () => {
      const contents = {
        date: Date.now(),
        data: []
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await node.resolveVersion('9001.x.x');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired Node version cannot be found.');
    });

    test('Logs an error if version is invalid', async () => {
      const contents = {
        date: Date.now(),
        data: []
      };

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      const result = await node.resolveVersion('asdf');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired Node version cannot be found.');
    });
  });
});
