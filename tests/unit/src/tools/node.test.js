// TODO: Mock out all network calls with dummy data
// TODO: Mock out filesystem
import {
  existsSync,
  readFileSync,
  unlinkSync
} from 'node:fs';
import { join } from 'node:path';

import axios from 'axios';

import node from '@/tools/node.js';

import { LATEST_NODE } from '@@/data/constants.js';
import { error } from '@@/data/error.js';

const __dirname = import.meta.dirname;
const nodeVersionsPath = join(__dirname, '..', '..', '..', '..', 'cacheLists', 'nodeVersions.json');
let allNodeVersions;

describe('node.js', () => {
  describe('getLatestReleases', () => {
    test('Network call fails', async () => {
      const axiosGet = axios.get;
      axios.get = vi.fn(() => Promise.reject(error));

      if (existsSync(nodeVersionsPath)) {
        allNodeVersions = JSON.parse(readFileSync(nodeVersionsPath));
      }
      const releases = await node.getLatestReleases();

      expect(releases.data.length > 100)
        .toEqual(true);

      expect(releases.data.length)
        .toEqual(allNodeVersions.data.length);

      expect(console.log)
        .toHaveBeenCalledWith('Error checking for latest Node releases');

      expect(console.log)
        .toHaveBeenCalledWith(error);

      axios.get = axiosGet;
    });

    test('Updates the nodeVersions.json file', async () => {
      if (existsSync(nodeVersionsPath)) {
        unlinkSync(nodeVersionsPath);
      }

      const releases = await node.getLatestReleases();

      expect(readFileSync(nodeVersionsPath).length > 100)
        .toEqual(true);

      expect(releases.data.length > 100)
        .toEqual(true);

      expect(releases.data.length)
        .toEqual(allNodeVersions.data.length);

      expect(console.log)
        .not.toHaveBeenCalled();
    });

    test('Running twice in a row skips the network call', async () => {
      const axiosGet = axios.get;
      axios.get = vi.fn();

      await node.getLatestReleases();

      expect(axios.get)
        .not.toHaveBeenCalled();

      axios.get = axiosGet;
    });
  });

  describe('getCachedReleases', () => {
    test('Loads contents', () => {
      if (existsSync(nodeVersionsPath)) {
        allNodeVersions = JSON.parse(readFileSync(nodeVersionsPath));
      }

      expect(node.getCachedReleases().data)
        .toEqual(allNodeVersions.data);
    });
  });

  describe('resolveVersion', () => {
    const axiosGet = axios.get;

    beforeEach(() => {
      axios.get = vi.fn(() => Promise.reject(error));
    });

    afterEach(() => {
      axios.get = axiosGet;
    });

    test('Returns the value if it is already exact', async () => {
      const result = await node.resolveVersion('22.0.0');

      expect(result)
        .toEqual('22.0.0');
    });

    test('Returns the latest Node version', async () => {
      const result = await node.resolveVersion('latest');

      expect(result)
        .toEqual(LATEST_NODE);
    });

    test('Returns the LTS Node version', async () => {
      const result = await node.resolveVersion('lts');

      expect(result)
        .toMatchInlineSnapshot('"24.14.0"');
    });

    test('Returns the latest Node version 22', async () => {
      const result = await node.resolveVersion('22.x.x');

      expect(result)
        .toMatchInlineSnapshot('"22.22.0"');
    });

    test('Console logs error if Node version cannot be satisfied', async () => {
      await node.resolveVersion('9001.x.x');

      expect(console.log)
        .toHaveBeenCalledWith('Desired Node version cannot be found.');
    });

    test('Console logs error for invalid Node version', async () => {
      await node.resolveVersion('asdf');

      expect(console.log)
        .toHaveBeenCalledWith('Desired Node version cannot be found.');
    });
  });
});
