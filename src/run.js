/**
 * @file The core logic execution of the devEngines CLI tool.
 */

import { getCliVersion } from './cliVersion.js';
import { showHelpMenu } from './helpMenu.js';
import { supportedTools } from './helpers.js';
import { setToolInDevEngines } from './manifestUtilities.js';
import node from './tools/node.js';
import npm from './tools/npm.js';
import unsupported from './tools/unsupportedTool.js';

/**
 * Update a tool, like Node or npm.
 *
 * @param {string} tool     'node' or 'npm'
 * @param {string} version  User argument
 */
const updateTool = async function (tool, version) {
  const titleMap = {
    bun: 'Bun',
    deno: 'Deno',
    node: 'Node',
    npm: 'npm',
    pnpm: 'PNPM',
    yarn: 'Yarn'
  };
  const titleCase = titleMap[tool] || tool;
  const toolMap = {
    node,
    npm
  };
  const toolHelpers = toolMap[tool] || unsupported;
  let desiredVersion = version;
  let resolvedVersion = await toolHelpers.resolveVersion(desiredVersion);
  console.log('Pin local ' + titleCase + ' to ' + resolvedVersion);
  // TODO: Uncomment once mock-fs in tests
  // setToolInDevEngines(tool, version);
};

/**
 * Updates both Node and npm to Latest or LTS version
 * in the local package.json.
 *
 * @param {string} arg  User argument
 */
export const updateAllTools = async function (arg) {
  // TODO: look up what tools the package.json:devEngines use
  // TODO: Update Node and/or npm versions in the package.json:devEngines after resolved
  if (arg === 'lts') {
    console.log('Pin local to LTS');
  } else if (arg === 'latest') {
    console.log('Pin local to latest');
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
  if (isGlobal) {
    if (!arg) {
      console.log('Missing an argument after -g');
    } else {
      // TODO: stub
      console.log('Global install of ' + arg);
    }
  } else if (['--version', '-v', 'v', 'version'].includes(arg)) {
    console.log('devEngines ' + getCliVersion());
  } else if (['lts', 'latest'].includes(arg)) {
    await updateAllTools(arg);
  } else if (arg.includes('@')) {
    const [name, version] = arg.split('@');
    if (supportedTools.includes(name) && version) {
      await updateTool(name, version);
    } else {
      showHelpMenu();
    }
  } else {
    showHelpMenu();
  }
};
