import { dirname } from 'node:path';

import { fs, vol } from 'memfs';

import { getCliVersion } from '@/cliVersion.js';
import { files } from '@/pathMap.js';

import { CLI_VERSION } from '@@/data/constants.js';
import { error } from '@@/data/error.js';

vi.mock('node:fs', () => {
  return {
    ...fs,
    writeFileSync: vi.fn((file, data) => {
      if (global.writeFileSyncShouldThrow) {
        throw error;
      } else {
        return fs.writeFileSync(file, data);
      }
    })
  };
});

describe('cliVersion.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    vol.mkdirSync(dirname(files.projectManifest), { recursive: true });
  });

  afterEach(() => {
    global.writeFileSyncShouldThrow = false;
  });

  describe('getCliVersion', () => {
    test('Returns version from manifest', () => {
      const contents = {
        name: 'DummyManifest',
        version: CLI_VERSION.replace('v', '')
      };

      vol.writeFileSync(files.projectManifest, JSON.stringify(contents));

      expect(getCliVersion())
        .toEqual(CLI_VERSION);
    });

    test('Returns error message', () => {
      global.writeFileSyncShouldThrow = true;

      expect(getCliVersion())
        .toEqual('[Error checking devEngines CLI version]');
    });
  });
});
