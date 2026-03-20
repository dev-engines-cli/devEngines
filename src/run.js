/**
 * @file The core logic execution of the devEngines CLI tool.
 */

import { getCliVersion } from './cliVersion.js';
import { setGlobalToolVersion } from './globalTools.js';
import { showHelpMenu } from './helpMenu.js';
import {
  getToolTitleCase,
  supportedTools
} from './helpers.js';
import { setToolInDevEngines } from './manifestUtilities.js';
import node from './tools/node.js';
import npm from './tools/npm.js';
import unsupported from './tools/unsupportedTool.js';

/**
 * Update a tool, like Node or npm.
 *
 * @param {string}  tool      'node' or 'npm'
 * @param {string}  version   User argument
 * @param {boolean} isGlobal  User requested a global install with -g
 */
const updateTool = async function (tool, version, isGlobal) {
  const titleCase = getToolTitleCase(tool);
  const toolMap = {
    node,
    npm
  };
  const toolHelpers = toolMap[tool] || unsupported;
  let desiredVersion = version;
  let resolvedVersion = await toolHelpers.resolveVersion(desiredVersion);
  if (isGlobal) {
    setGlobalToolVersion(tool, resolvedVersion);
  } else {
    setToolInDevEngines(tool, resolvedVersion);
  }
};

/**
 * Updates both Node and npm to Latest or LTS version
 * in the local package.json.
 *
 * @param {string}  arg       User argument
 * @param {boolean} isGlobal  If the user requested a global install with -g
 */
export const updateAllTools = async function (arg, isGlobal) {
  // TODO: look up what tools the package.json:devEngines use
  // TODO: Update Node and/or npm versions in the package.json:devEngines after resolved
  if (arg === 'lts') {
    if (isGlobal) {
      console.log('Pin global to LTS');
    } else {
      console.log('Pin local to LTS');
    }
  } else if (arg === 'latest') {
    if (isGlobal) {
      console.log('Pin global to latest');
    } else {
      console.log('Pin local to latest');
    }
  }
};

/**
 * Runs the core logic of the CLI.
 *
 * @param {boolean} isGlobal  If the user requested a global install with -g
 * @param {string}  arg       The command line argument provided by the user
 */
export const run = async function (isGlobal, arg) {
  arg = arg || '';
  if (isGlobal && !arg) {
    console.log('Missing an argument after -g');
  } else if (['--version', '-v', 'v', 'version'].includes(arg)) {
    console.log('devEngines ' + getCliVersion());
  } else if (['lts', 'latest'].includes(arg)) {
    await updateAllTools(arg, isGlobal);
  } else if (arg.includes('@')) {
    const [name, version] = arg.split('@');
    if (supportedTools.includes(name) && version) {
      await updateTool(name, version, isGlobal);
    } else {
      showHelpMenu();
    }
  } else {
    showHelpMenu();
  }
};
