import { join } from 'node:path';

import axios from 'axios';
import { fs, vol } from 'memfs';

import {
  findManifest,
  getManifestData,
  getRawToolVersions,
  getResolvedToolVersions,
  mutateManifest,
  setToolInDevEngines
} from '@/manifestUtilities.js';
import { files } from '@/pathMap.js';

import { LATEST_NODE } from '@@/data/constants.js';
import {
  makeCacheListFolder,
  makeCachedNodeReleases,
  makeProjectManifest,
  mockNodeReleases
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
const __dirname = import.meta.dirname;

describe('manifestUtilities.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  describe('findManifest', () => {
    test('Finds the manifest', () => {
      makeProjectManifest(vol);

      expect(findManifest())
        .toEqual(files.projectManifest);
    });

    test('Hits max attempts', () => {
      const deepPath = join(
        __dirname,
        '..',
        '..',
        'data',
        '22',
        '21',
        '20',
        '19',
        '18',
        '17',
        '16',
        '15',
        '14',
        '13',
        '12',
        '11',
        '10',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
        '1',
        '0'
      );
      makeProjectManifest(vol);
      vol.mkdirSync(deepPath, { recursive: true });

      expect(findManifest(deepPath))
        .toEqual(undefined);
    });

    test('Hits system root', () => {
      expect(findManifest())
        .toEqual(undefined);
    });
  });

  describe('getManifestData', () => {
    test('Returns the manifest as JSON', () => {
      makeProjectManifest(vol);
      const data = getManifestData();

      expect(typeof(data) === 'object')
        .toEqual(true);

      expect(data.eol)
        .toEqual('\n');

      expect(data.indentation)
        .toEqual(2);

      expect(data.manifestPath)
        .toEqual(files.projectManifest);

      expect(typeof(data.manifest) === 'object')
        .toEqual(true);

      expect(data.manifest.name)
        .toEqual('dummy-manifest');
    });

    test('Returns empty object if manifest not found', () => {
      const data = getManifestData();

      expect(data)
        .toEqual({
          eol: undefined,
          indentation: undefined,
          manifestPath: undefined,
          manifest: undefined
        });
    });
  });

  describe('getRawToolVersions', () => {
    test('Returns common versions', () => {
      makeProjectManifest(vol, {
        devEngines: {
          runtime: {
            name: 'node',
            version: '25.0.0'
          },
          packageManager: {
            name: 'npm',
            version: '11.0.0'
          }
        }
      });

      expect(getRawToolVersions())
        .toEqual({
          node: '25.0.0',
          npm: '11.0.0'
        });
    });

    test('Returns array versions', () => {
      makeProjectManifest(vol, {
        devEngines: {
          runtime: [
            {
              name: 'node',
              version: '25.0.0'
            },
            {
              name: 'deno',
              version: '2.0.0'
            },
            {
              name: 'bun',
              version: '1.0.0'
            },
            {
              name: 'missing version'
            }
          ],
          packageManager: [
            {
              name: 'npm',
              version: '11.0.0'
            },
            {
              name: 'pnpm',
              version: '3.0.0'
            },
            {
              name: 'yarn',
              version: '2.0.0'
            },
            {
              version: 'missing name'
            }
          ]
        }
      });

      expect(getRawToolVersions())
        .toEqual({
          node: '25.0.0',
          deno: '2.0.0',
          bun: '1.0.0',
          npm: '11.0.0',
          pnpm: '3.0.0',
          yarn: '2.0.0'
        });
    });

    test('Returns empty object when devEngines missing', () => {
      makeProjectManifest(vol, {});

      expect(getRawToolVersions())
        .toEqual({});
    });

    test('Returns empty object when no versions defined', () => {
      makeProjectManifest(vol, {
        devEngines: {
          runtime: {},
          packageManager: {}
        }
      });

      expect(getRawToolVersions())
        .toEqual({});
    });

    test('Skips unsupported tools (object)', () => {
      makeProjectManifest(vol, {
        devEngines: {
          runtime: {
            name: 'fake',
            version: '1.0.0'
          }
        }
      });

      expect(getRawToolVersions())
        .toEqual({});
    });

    test('Skips unsupported tools (array)', () => {
      makeProjectManifest(vol, {
        devEngines: {
          runtime: [
            {
              name: 'fake',
              version: '1.0.0'
            }
          ]
        }
      });

      expect(getRawToolVersions())
        .toEqual({});
    });
  });

  describe('getResolvedToolVersions', () => {
    test('Resolve Node version', async () => {
      makeCacheListFolder(vol);
      makeCachedNodeReleases(vol);
      mockNodeReleases(mockedAxiosGet);
      makeProjectManifest(vol, {
        devEngines: {
          runtime: {
            name: 'node',
            version: '>25.0.0'
          }
        }
      });
      const versions = await getResolvedToolVersions();

      expect(versions)
        .toEqual({ node: LATEST_NODE });
    });
  });

  describe('mutateManifest', () => {
    test('Manifest has no devEngines', () => {
      let manifest = {};
      mutateManifest(manifest, 'runtime', 'node', '25.0.0');

      expect(manifest)
        .toEqual({
          devEngines: {
            runtime: {
              name: 'node',
              version: '25.0.0'
            }
          }
        });
    });

    test('Sub-section is array', () => {
      let manifest = {
        devEngines: {
          runtime: [
            {
              name: 'bun',
              version: '1.0.0'
            }
          ]
        }
      };
      mutateManifest(manifest, 'runtime', 'node', '25.0.0');

      expect(manifest)
        .toEqual({
          devEngines: {
            runtime: [
              {
                name: 'bun',
                version: '1.0.0'
              },
              {
                name: 'node',
                version: '25.0.0'
              }
            ]
          }
        });
    });

    test('Sub-section is array with the tool already present', () => {
      let manifest = {
        devEngines: {
          runtime: [
            {
              name: 'node',
              version: '24.0.0'
            },
            {
              name: 'bun',
              version: '1.0.0'
            }
          ]
        }
      };
      mutateManifest(manifest, 'runtime', 'node', '25.0.0');

      expect(manifest)
        .toEqual({
          devEngines: {
            runtime: [
              {
                name: 'node',
                version: '25.0.0'
              },
              {
                name: 'bun',
                version: '1.0.0'
              }
            ]
          }
        });
    });

    test('Sub-section is an object with a different tool', () => {
      let manifest = {
        devEngines: {
          runtime: {
            name: 'bun',
            version: '1.0.0'
          }
        }
      };
      mutateManifest(manifest, 'runtime', 'node', '25.0.0');

      expect(manifest)
        .toEqual({
          devEngines: {
            runtime: [
              {
                name: 'bun',
                version: '1.0.0'
              },
              {
                name: 'node',
                version: '25.0.0'
              }
            ]
          }
        });
    });

    test('Sub-section is an object with the tool present', () => {
      let manifest = {
        devEngines: {
          runtime: {
            name: 'node',
            version: '24.0.0'
          }
        }
      };
      mutateManifest(manifest, 'runtime', 'node', '25.0.0');

      expect(manifest)
        .toEqual({
          devEngines: {
            runtime: {
              name: 'node',
              version: '25.0.0'
            }
          }
        });
    });
  });

  describe('setToolInDevEngines', () => {
    test('Logs for unsupported tool', () => {
      setToolInDevEngines('asdf', '1.0.0');

      expect(console.log)
        .toHaveBeenCalledWith('Your version of devEngines CLI does not support "asdf".');
    });

    test('Logs when no manifest found', () => {
      setToolInDevEngines('node', '11.0.0');

      expect(console.log)
        .toHaveBeenCalledWith(
          'Could not set node@11.0.0 in package.json:devEngines:runtime.'
        );
    });

    describe('Set versions in file without devEngines', () => {
      function checkDummyFile () {
        return String(vol.readFileSync(files.projectManifest)).trim();
      }

      test('Sets node@25.0.0', () => {
        makeProjectManifest(vol, { name: 'set-versions' });

        expect(checkDummyFile())
          .toEqual([
            '{',
            '  "name": "set-versions"',
            '}'
          ].join('\n'));

        setToolInDevEngines('node', '25.0.0');

        expect(checkDummyFile())
          .toEqual([
            '{',
            '  "name": "set-versions",',
            '  "devEngines": {',
            '    "runtime": {',
            '      "name": "node",',
            '      "version": "25.0.0"',
            '    }',
            '  }',
            '}'
          ].join('\n'));
      });

      test('Sets npm@11.0.0', () => {
        makeProjectManifest(vol, { name: 'set-versions' });

        expect(checkDummyFile())
          .toEqual([
            '{',
            '  "name": "set-versions"',
            '}'
          ].join('\n'));

        setToolInDevEngines('npm', '11.0.0');

        expect(checkDummyFile())
          .toEqual([
            '{',
            '  "name": "set-versions",',
            '  "devEngines": {',
            '    "packageManager": {',
            '      "name": "npm",',
            '      "version": "11.0.0"',
            '    }',
            '  }',
            '}'
          ].join('\n'));
      });
    });
  });
});
