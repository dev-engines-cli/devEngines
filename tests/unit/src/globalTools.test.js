import { fs, vol } from 'memfs';

import {
  getGlobalToolVersions,
  setGlobalToolVersion
} from '@/globalTools.js';
import { files } from '@/pathMap.js';

import { error } from '@@/data/error.js';
import { makeGlobalToolsDummyData } from '@@/unit/testHelpers.js';

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

const globalToolsPath = files.globalTools;

describe('globalTools.js', () => {
  let globalToolsDummyData;

  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    globalToolsDummyData = makeGlobalToolsDummyData(vol);
  });

  afterEach(() => {
    global.writeFileSyncShouldThrow = false;
  });

  describe('getGlobalToolVersions', () => {
    test('Returns the global versions', () => {
      expect(getGlobalToolVersions())
        .toEqual({
          bun: '',
          deno: '',
          node: globalToolsDummyData.node,
          npm: globalToolsDummyData.npm,
          pnpm: '',
          yarn: ''
        });
    });

    test('Does not find the globalTools.json', () => {
      vol.unlinkSync(globalToolsPath);

      expect(getGlobalToolVersions())
        .toEqual({
          bun: '',
          deno: '',
          node: '',
          npm: '',
          pnpm: '',
          yarn: ''
        });
    });
  });

  describe('setGlobalToolVersion', () => {
    test('Does not change the file if tool is invalid', () => {
      setGlobalToolVersion('asdf', '1.0.0');

      expect(JSON.parse(vol.readFileSync(globalToolsPath)))
        .toEqual(globalToolsDummyData);
    });

    test('Sets the versions of each tool', () => {
      setGlobalToolVersion('bun', '1.0.0');
      setGlobalToolVersion('deno', '2.0.0');
      setGlobalToolVersion('node', '3.0.0');
      setGlobalToolVersion('npm', '4.0.0');
      setGlobalToolVersion('pnpm', '5.0.0');
      setGlobalToolVersion('yarn', '6.0.0');

      expect(JSON.parse(vol.readFileSync(globalToolsPath)))
        .toEqual({
          bun: '1.0.0',
          deno: '2.0.0',
          node: '3.0.0',
          npm: '4.0.0',
          pnpm: '5.0.0',
          yarn: '6.0.0'
        });
    });

    test('Catches failure to write to file system', () => {
      global.writeFileSyncShouldThrow = true;

      setGlobalToolVersion('node', '24.0.0');

      expect(console.log)
        .toHaveBeenCalledWith('Error setting Node to 24.0.0 in:\n' + globalToolsPath);
    });
  });
});
