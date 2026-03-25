import { dirname } from 'node:path';

import { fs, vol } from 'memfs';

import {
  determineEndOfLineCharacter,
  determineIndentation,
  ensureFolderExists,
  getToolTitleCase
} from '@/helpers.js';
import { files } from '@/pathMap.js';

import { makeCacheListFolder } from '@@/unit/testHelpers.js';

vi.mock('node:fs', () => {
  return fs;
});

describe('helpers.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  describe('determineEndOfLineCharacter', () => {
    test.each([
      ['CRLF', '\r\n'],
      ['CR', '\r'],
      ['LF', '\n']
    ])('Detect %s', (name, eol) => {
      const data = [
        '{',
        '  "name": "test"',
        '}'
      ].join(eol);

      expect(determineEndOfLineCharacter(data))
        .toEqual(eol);
    });
  });

  describe('ensureFolderExists', () => {
    test('Folder already exists', () => {
      makeCacheListFolder(vol);

      const folder = dirname(files.cachedNodeVersions);

      expect(vol.existsSync(folder))
        .toEqual(true);

      ensureFolderExists(folder);

      expect(vol.existsSync(folder))
        .toEqual(true);

      expect(console.log)
        .not.toHaveBeenCalled();
    });

    test('Creates folder already exists', () => {
      const folder = dirname(files.cachedNodeVersions);

      expect(vol.existsSync(folder))
        .toEqual(false);

      ensureFolderExists(folder);

      expect(vol.existsSync(folder))
        .toEqual(true);

      expect(console.log)
        .not.toHaveBeenCalled();
    });
  });

  describe('getToolTitleCase', () => {
    test('Returns all titles', () => {
      expect(getToolTitleCase('node'))
        .toEqual('Node');

      expect(getToolTitleCase('bun'))
        .toEqual('Bun');

      expect(getToolTitleCase('deno'))
        .toEqual('Deno');

      expect(getToolTitleCase('node'))
        .toEqual('Node');

      expect(getToolTitleCase('npm'))
        .toEqual('npm');

      expect(getToolTitleCase('pnpm'))
        .toEqual('PNPM');

      expect(getToolTitleCase('yarn'))
        .toEqual('Yarn');

      expect(getToolTitleCase('FAKE_TOOL_NAME'))
        .toEqual('FAKE_TOOL_NAME');
    });
  });

  describe('determineIndentation', () => {
    test.each([
      ['tabs', '\t', '\t'],
      ['1 space', ' ', 1],
      ['2 spaces', '  ', 2],
      ['3 spaces', '   ', 3],
      ['4 spaces', '    ', 4],
      ['5 spaces', '     ', 5],
      ['6 spaces', '      ', 6],
      ['7 spaces', '       ', 7],
      ['8 spaces', '        ', 8]
    ])('Detects %s', (name, indentation, amount) => {
      const data = [
        '{',
        indentation + '"name": "test"',
        '}'
      ].join('\n');

      expect(determineIndentation(data))
        .toEqual(amount);
    });
  });
});
