/**
 * @file Displays the help menu in the devEngines CLI.
 */

import { getCliVersion } from './cliVersion.js';

/**
 * The help menu is shown whenever an
 * empty or unrecognized command is ran.
 * It contains examples of how to use the CLI.
 */
export const showHelpMenu = function () {
  console.log([
    'devEngines CLI ' + getCliVersion(),
    'Node and npm version switching and pinning',
    '',
    'Updating all versions in the local package.json',
    '  devEngines lts',
    '  devEngines latest',
    '',
    'Globally update all versions (fallback if local tool version not found)',
    '  devEngines -g lts',
    '  devEngines -g latest',
    '',
    'Pinning a specific tool locally',
    '  devEngines [toolname]@[version]',
    '  devEngines node@lts',
    '  devEngines node@latest',
    '  devEngines node@24.0.0',
    '  devEngines node@24',
    '  devEngines npm@latest',
    '  etc.',
    '',
    'Pinning a specific tool globally (fallback if local tool version not found)',
    '  devEngines -g [toolname]@[version]',
    '  devEngines -g node@lts',
    '  etc.',
    '',
    'Clearing local cache of tool version downloads',
    '  devEngines purge',
    '',
    'Get the devEngines CLI version',
    '  devEngines -v'
  ].join('\n'));
};
