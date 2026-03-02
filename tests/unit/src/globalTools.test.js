import {
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

import { getGlobalToolVersions } from '@/globalTools.js';

const __dirname = import.meta.dirname;

describe('globalTools.js', () => {
  describe('getGlobalToolVersions', () => {
    test('Returns the global versions', () => {
      expect(getGlobalToolVersions())
        .toEqual({
          bun: '',
          deno: '',
          node: '25.0.0',
          npm: '11.0.0',
          pnpm: '',
          yarn: ''
        });
    });

    test('Does not find the globalTools.json', () => {
      const globalToolsPath = join(__dirname, '..', '..', '..', 'globalTools.json');
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

      const content = JSON.stringify({ node: '25.0.0', npm: '11.0.0' }, null, 2) + '\n';

      writeFileSync(globalToolsPath, content);
    });
  });
});
