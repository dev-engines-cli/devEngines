import { dirname, join } from 'node:path';

import axios from 'axios';
import { fs, vol } from 'memfs';

import npm from '@/tools/npm.js';

vi.mock('node:fs', () => fs);
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));
const mockedAxiosGet = vi.mocked(axios.get);

const __dirname = import.meta.dirname;
const cachePath = join(__dirname, '..', '..', '..', '..', 'cacheLists', 'npmVersions.json');

const makeReleases = (data, date = Date.now()) => ({ date, data });

describe('npm.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    vol.mkdirSync(dirname(cachePath), { recursive: true });
  });

  describe('getLatestReleases', () => {
    test('Fetches once then uses cache', async () => {
      const versions = ['1.1.0', '1.0.0'];
      mockedAxiosGet.mockResolvedValue({
        data: {
          versions: Object.fromEntries(
            versions.map((version) => [version, {}])
          )
        }
      });

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
      const contents = makeReleases(['1.0.0']);

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      expect(npm.getCachedReleases())
        .toEqual(contents);
    });
  });

  describe('resolveVersion', () => {
    test('Resolves semver exact versions', async () => {
      const exact = '11.0.0';
      const contents = makeReleases([exact]);

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      await expect(npm.resolveVersion(exact))
        .resolves.toBe(exact);
    });

    test('Resolves "latest"', async () => {
      const latest = '11.11.0';
      const contents = makeReleases([latest, '11.0.0']);

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      await expect(npm.resolveVersion('latest'))
        .resolves.toBe(latest);
    });

    test('Resolves semver x-ranges', async () => {
      const latest = '9.9.4';
      const contents = makeReleases([latest, '9.0.0']);

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      await expect(npm.resolveVersion('9.x.x'))
        .resolves.toBe(latest);
    });

    test('Logs an error if version cannot be resolved', async () => {
      const contents = makeReleases([]);

      fs.writeFileSync(cachePath, JSON.stringify(contents));

      await expect(npm.resolveVersion('9001.0.0'))
        .resolves.toBe(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');

      await expect(npm.resolveVersion('asdf'))
        .resolves.toBe(undefined);

      expect(console.log)
        .toHaveBeenCalledWith('Desired npm version cannot be found.');
    });
  });
});
