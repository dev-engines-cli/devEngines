import {
  readFileSync,
  unlinkSync
} from 'node:fs';

import {
  getGlobalToolVersions,
  setGlobalToolVersion
} from '@/globalTools.js';

import {
  globalToolsPath,
  globalToolsDummyData,
  resetGlobalToolsFile
} from '@@/unit/testHelpers.js';

describe('globalTools.js', () => {
  afterEach(() => {
    // TODO: remove after mock-fs setup
    resetGlobalToolsFile();
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
      unlinkSync(globalToolsPath);

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

      expect(JSON.parse(readFileSync(globalToolsPath)))
        .toEqual(globalToolsDummyData);
    });

    test('Sets the versions of each tool', () => {
      setGlobalToolVersion('bun', '1.0.0');
      setGlobalToolVersion('deno', '2.0.0');
      setGlobalToolVersion('node', '3.0.0');
      setGlobalToolVersion('npm', '4.0.0');
      setGlobalToolVersion('pnpm', '5.0.0');
      setGlobalToolVersion('yarn', '6.0.0');

      expect(JSON.parse(readFileSync(globalToolsPath)))
        .toEqual({
          bun: '1.0.0',
          deno: '2.0.0',
          node: '3.0.0',
          npm: '4.0.0',
          pnpm: '5.0.0',
          yarn: '6.0.0'
        });
    });
  });
});
