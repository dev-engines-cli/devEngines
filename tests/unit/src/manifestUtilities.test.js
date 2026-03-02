import {
  readFileSync,
  writeFileSync
} from 'node:fs';
import {
  join,
  resolve
} from 'node:path';

import {
  findManifest,
  getManifestData,
  getRawToolVersions,
  mutateManifest,
  setToolInDevEngines
} from '@/manifestUtilities.js';

const __dirname = import.meta.dirname;

describe('manifestUtilities.js', () => {
  afterEach(() => {
    process.chdir(__dirname);
  });

  describe('findManifest', () => {
    test('Finds the manifest', () => {
      expect(findManifest())
        .toEqual(join(__dirname, '..', '..', '..', 'package.json'));
    });

    test('Hits max attempts', () => {
      process.chdir(
        join(
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
        )
      );

      expect(findManifest())
        .toEqual(undefined);
    });

    test('Hits system root', () => {
      process.chdir(join(__dirname, '..', '..', '..', '..'));

      expect(findManifest())
        .toEqual(undefined);
    });
  });

  describe('getManifestData', () => {
    test('Returns the manifest as JSON', () => {
      const data = getManifestData();

      expect(typeof(data) === 'object')
        .toEqual(true);

      expect(data.eol)
        .toEqual('\n');

      expect(data.indentation)
        .toEqual(2);

      expect(data.manifestPath)
        .toEqual(resolve('..', '..', '..', 'package.json'));

      expect(typeof(data.manifest) === 'object')
        .toEqual(true);

      expect(data.manifest.name)
        .toEqual('dev-engines');
    });

    test('Returns empty object if manifest not found', () => {
      process.chdir(join(__dirname, '..', '..', '..', '..'));

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
      process.chdir(join(__dirname, '..', '..', 'data', 'dummyNodeNpmVersions'));

      expect(getRawToolVersions())
        .toEqual({
          node: '25.0.0',
          npm: '11.0.0'
        });
    });

    test('Returns array versions', () => {
      process.chdir(join(__dirname, '..', '..', 'data', 'dummyNodeNpmArrayVersions'));

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
      process.chdir(join(__dirname, '..', '..', 'data', 'dummyNoDevEngines'));

      expect(getRawToolVersions())
        .toEqual({});
    });

    test('Returns empty object when no versions defined', () => {
      process.chdir(join(__dirname, '..', '..', 'data', 'dummyNoVersions'));

      expect(getRawToolVersions())
        .toEqual({});
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
      process.chdir(
        join(
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
        )
      );

      setToolInDevEngines('node', '11.0.0');

      expect(console.log)
        .toHaveBeenCalledWith(
          'Could not set node@11.0.0 in package.json:devEngines:runtime.'
        );
    });

    describe('Set versions in file without devEngines', () => {
      const setVersionsPath = join(__dirname, '..', '..', 'data', 'setVersions');
      const setVersionsManifestPath = join(setVersionsPath, 'package.json');

      function resetDummyFile () {
        const data = JSON.stringify({ name: 'set-versions' }, null, 2);
        writeFileSync(setVersionsManifestPath, data + '\n');
      }
      function checkDummyFile () {
        return String(readFileSync(setVersionsManifestPath)).trim();
      }

      beforeEach(() => {
        process.chdir(setVersionsPath);
        resetDummyFile();
      });

      afterEach(() => {
        resetDummyFile();
      });

      test('Sets node@25.0.0', () => {
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
