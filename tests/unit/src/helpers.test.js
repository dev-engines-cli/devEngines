import {
  determineEndOfLineCharacter,
  determineIndentation,
  getToolTitleCase
} from '@/helpers.js';

describe('helpers.js', () => {
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
