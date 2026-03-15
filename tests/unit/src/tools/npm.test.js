// TODO: Mock out all network calls with dummy data
// TODO: Mock out filesystem
import {
  existsSync,
  readFileSync,
  unlinkSync
} from 'node:fs';
import { join } from 'node:path';

import { LATEST_NPM } from '@@/data/constants.js';

import npm from '@/tools/npm.js';

const __dirname = import.meta.dirname;
const npmVersionsPath = join(__dirname, '..', '..', '..', '..', 'cacheLists', 'npmVersions.json');
let allNpmVersions;

describe('npm.js', () => {
  describe('getLatestReleases', () => {
    test('Updates the npmVersions.json file', async () => {
      if (existsSync(npmVersionsPath)) {
        allNpmVersions = JSON.parse(readFileSync(npmVersionsPath));
      }
      if (existsSync(npmVersionsPath)) {
        unlinkSync(npmVersionsPath);
      }

      const releases = await npm.getLatestReleases();

      expect(readFileSync(npmVersionsPath).length > 100)
        .toEqual(true);

      expect(releases.data.length > 100)
        .toEqual(true);

      expect(releases.data.length)
        .toEqual(allNpmVersions.data.length);

      expect(console.log)
        .not.toHaveBeenCalled();
    });

    test('Running twice in a row uses the cache', async () => {
      if (existsSync(npmVersionsPath)) {
        allNpmVersions = JSON.parse(readFileSync(npmVersionsPath));
      }
      const releases = await npm.getLatestReleases();

      expect(releases.date)
        .toEqual(allNpmVersions.date);
    });
  });

  describe('getCachedReleases', () => {
    test('Loads contents', () => {
      if (existsSync(npmVersionsPath)) {
        allNpmVersions = JSON.parse(readFileSync(npmVersionsPath));
      }

      expect(npm.getCachedReleases().data)
        .toEqual(allNpmVersions.data);
    });
  });

  describe('resolveVersion', () => {
    test('Returns the value if it is already exact', async () => {
      const result = await npm.resolveVersion('11.0.0');

      expect(result)
        .toEqual('11.0.0');
    });

    test('Returns the latest npm version', async () => {
      const result = await npm.resolveVersion('latest');

      expect(result)
        .toEqual(LATEST_NPM);
    });

    test('Returns the LTS npm version', async () => {
      const result = await npm.resolveVersion('lts');

      expect(result)
        .toEqual(LATEST_NPM);
    });

    test('Returns the latest npm version 9', async () => {
      const result = await npm.resolveVersion('9.x.x');

      expect(result)
        .toMatchInlineSnapshot('"9.9.4"');
    });

    test('Console logs error if npm version cannot be satisfied', async () => {
      await npm.resolveVersion('9001.x.x');

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });

    test('Console logs error for invalid npm version', async () => {
      await npm.resolveVersion('asdf');

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });
  });
});
