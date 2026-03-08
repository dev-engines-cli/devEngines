/**
 * @file Reusable helpers for unit tests.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const __dirname = import.meta.dirname;

export const globalToolsPath = join(__dirname, '..', '..', 'globalTools.json');
export const globalToolsDummyData = Object.freeze({
  node: '25.0.0',
  npm: '11.0.0'
});

/**
 * Resets the data in the globalTools.json file.
 * TODO: Remove after mock-fs setup.
 */
export const resetGlobalToolsFile = function () {
  const content = JSON.stringify(globalToolsDummyData, null, 2) + '\n';
  writeFileSync(globalToolsPath, content);
};
