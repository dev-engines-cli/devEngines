import axios from 'axios';
import { fs, vol } from 'memfs';

import { files } from '@/pathMap.js';
import node, { createNodeDownloadUrl } from '@/tools/node.js';

import { LATEST_NODE } from '@@/data/constants.js';
import { error } from '@@/data/error.js';
import {
  makeCacheListFolder,
  makeCachedNodeReleases,
  mockNodeReleases
} from '@@/unit/testHelpers.js';

let arch = 'x64';
let platform = 'linux';

vi.mock('node:fs', () => {
  return fs;
});
vi.mock('node:os', () => {
  return {
    arch: vi.fn(() => {
      return arch;
    }),
    platform: vi.fn(() => {
      return platform;
    })
  };
});
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  };
});
const mockedAxiosGet = vi.mocked(axios.get);

describe('node.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    makeCacheListFolder(vol);
  });

  describe('createNodeDownloadUrl', () => {
    test('Creates Node.js download url for Linux', () => {
      arch = 'x64';
      platform = 'linux';

      expect(createNodeDownloadUrl('22.22.2'))
        .toEqual('https://nodejs.org/dist/v22.22.2/node-v22.22.2-linux-x64.tar.gz');
    });

    test('Creates Node.js download url for OSX', () => {
      arch = 'arm64';
      platform = 'darwin';

      expect(createNodeDownloadUrl('22.22.2'))
        .toEqual('https://nodejs.org/dist/v22.22.2/node-v22.22.2-darwin-arm64.tar.gz');
    });

    test('Creates Node.js download url for Windows', () => {
      arch = 'x64';
      platform = 'win32';

      expect(createNodeDownloadUrl('22.22.2'))
        .toEqual('https://nodejs.org/dist/v22.22.2/node-v22.22.2-win-x64.zip');
    });
  });

  describe('getLatestReleases', () => {
    test('Network call fails', async () => {
      const contents = makeCachedNodeReleases(vol);
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
      makeCachedNodeReleases(vol);
      const releases = mockNodeReleases(mockedAxiosGet);
      const run1 = await node.getLatestReleases();
      const run2 = await node.getLatestReleases();
      const cache = JSON.parse(fs.readFileSync(files.cachedNodeVersions, 'utf8'));

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
      const contents = makeCachedNodeReleases(vol);

      expect(node.getCachedReleases())
        .toEqual(contents);
    });
  });

  describe('resolveVersion', () => {
    test('Resolves semver exact versions', async () => {
      makeCachedNodeReleases(vol);
      const exact = '22.0.0';
      const result = await node.resolveVersion(exact);

      expect(result)
        .toEqual(exact);
    });

    test('Resolves "latest"', async () => {
      makeCachedNodeReleases(vol);
      const result = await node.resolveVersion('latest');

      expect(result)
        .toEqual(LATEST_NODE);
    });

    test('Resolves "lts"', async () => {
      makeCachedNodeReleases(vol);
      const result = await node.resolveVersion('lts');

      expect(result)
        .toEqual('24.14.0');
    });

    test('Resolves semver x-ranges', async () => {
      makeCachedNodeReleases(vol);
      const result = await node.resolveVersion('25.x.x');

      expect(result)
        .toEqual(LATEST_NODE);
    });

    test('Logs an error if version cannot be resolved', async () => {
      makeCachedNodeReleases(vol);
      const result = await node.resolveVersion('9001.x.x');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired Node version cannot be found.');
    });

    test('Logs an error if version is invalid', async () => {
      makeCachedNodeReleases(vol);
      const result = await node.resolveVersion('asdf');

      expect(result)
        .toEqual(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired Node version cannot be found.');
    });
  });
});
