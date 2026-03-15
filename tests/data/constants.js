/**
 * @file Reusable test constants
 */

export const LATEST_NODE = '25.8.1';
export const LATEST_NPM = '11.11.1';
export const CLI_VERSION = 'v0.0.1';
export const HELP_MENU = [
  'devEngines CLI ' + CLI_VERSION,
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
].join('\n');
