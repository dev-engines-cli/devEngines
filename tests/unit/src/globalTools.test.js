import {
  readFileSync,
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

import {
  getGlobalToolVersions,
  setGlobalToolVersion
} from '@/globalTools.js';

const __dirname = import.meta.dirname;
const globalToolsPath = join(__dirname, '..', '..', '..', 'globalTools.json');

const dummyData = Object.freeze({
  node: '25.0.0',
  npm: '11.0.0'
});

/**
 * Resets the data in the globalTools.json file.
 * TODO: Remove after mock-fs setup.
 */
function resetGlobalToolsFile () {
  const content = JSON.stringify(dummyData, null, 2) + '\n';
  writeFileSync(globalToolsPath, content);
}

describe('globalTools.js', () => {
  afterEach(() => {
    resetGlobalToolsFile();
  });

  describe('getGlobalToolVersions', () => {
    test('Returns the global versions', () => {
      expect(getGlobalToolVersions())
        .toEqual({
          bun: '',
          deno: '',
          node: dummyData.node,
          npm: dummyData.npm,
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
        .toEqual(dummyData);
    });

    test('Sets the versions of each tool', () => {
      setGlobalToolVersion('bun', '1.0.0');
      setGlobalToolVersion('deno', '1.0.0');
      setGlobalToolVersion('node', '1.0.0');
      setGlobalToolVersion('npm', '1.0.0');
      setGlobalToolVersion('pnpm', '1.0.0');
      setGlobalToolVersion('yarn', '1.0.0');

      expect(JSON.parse(readFileSync(globalToolsPath)))
        .toEqual({
          bun: '1.0.0',
          deno: '1.0.0',
          node: '1.0.0',
          npm: '1.0.0',
          pnpm: '1.0.0',
          yarn: '1.0.0'
        });
    });
  });
});
