/**
 * @file Reusable generic shims function.
 */

import { getGlobalToolVersions } from './globalTools.js';
import { supportedTools } from './helpers.js';
import { getResolvedToolVersions } from './manifestUtilities.js';

/** @typedef {import('./types.js').TOOL} TOOL */

/**
 * Generic function for running any of the shims.
 *
 * @param {TOOL} tool  Name of the tool ('node', 'npm', etc)
 */
export const runShim = async function (tool) {
  if (!supportedTools.includes(tool)) {
    console.log('Unsupported tool: ' + tool);
    return;
  }

  const resolvedVersions = await getResolvedToolVersions();

  if (resolvedVersions[tool]) {
    console.log('Download and install: ' + tool + '@' + resolvedVersions[tool]);
  } else {
    const globalTools = getGlobalToolVersions();
    if (globalTools[tool]) {
      console.log('Download and install: ' + tool + '@' + globalTools[tool]);
    }
  }

  console.log(process.argv.slice(2));
};
