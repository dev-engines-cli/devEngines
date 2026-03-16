/**
 * @file Reusable helpers for unit tests.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { files } from '@/pathMap.js';

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
  writeFileSync(files.globalTools, content);
};
