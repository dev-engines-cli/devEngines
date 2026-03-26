import { dirname, join } from 'node:path'
import { homedir } from 'node:os';

import { fs, vol } from 'memfs';

import { initializeState } from '@@@/src/state.js';

vi.mock('node:fs', () => {
  return fs;
});

describe('Installer state', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  describe('Inititialize state', () => {
    test('Generates default state', () => {
      const state = initializeState();

      expect(Object.keys(state).sort())
        .toEqual([
          'cwd',
          'devEnginesCliManifestPath',
          'dotDevEnginesPath',
          'existingVersion',
          'gitInstalled',
          'homeDirectory',
          'manifestExists'
        ]);

      expect(state.cwd)
        .toEqual(process.cwd());

      expect((
        state.devEnginesCliManifestPath.endsWith('/.devEngines/package.json') ||
        state.devEnginesCliManifestPath.endsWith('\\.devEngines\\package.json')
      ))
        .toEqual(true);

      expect(state.dotDevEnginesPath.endsWith('.devEngines'))
        .toEqual(true);

      expect(state.existingVersion)
        .toEqual(undefined)

      expect(state.gitInstalled)
        .toEqual(true);

      expect(state.manifestExists)
        .toEqual(false);
    });

    test('Detects already installed devEngines CLI', () => {
      const cliManifest = join(homedir(), '.devEngines', 'package.json');
      const content = JSON.stringify({ version: '1.0.0' }, null, 2) + '\n';
      vol.mkdirSync(dirname(cliManifest), { recursive: true });
      vol.writeFileSync(cliManifest, content);

      const state = initializeState();

      expect(state.existingVersion)
        .toEqual('1.0.0')

      expect(state.manifestExists)
        .toEqual(true);
    });
  });
});
