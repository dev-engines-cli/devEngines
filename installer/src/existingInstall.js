/**
 * @file Logic for dealing with existing devEngines CLI installs.
 */

import console from 'node:console';

import { select } from '@clack/prompts';

/** @typedef {import('../types.js').STATE} STATE */

const attemptUpgrade = async function () {
  console.log('STUB: attemptUpgrade');
  return 'done';
};

const deleteAndReinstall = async function () {
  console.log('STUB: deleteAndReinstall');
  return 'done';
};

const uninstallDevEnginesCli = async function () {
  console.log('STUB: uninstallDevEnginesCli');
  return 'done';
};

/**
 * Handles if an existing install of devEngines is found, letting
 * the user pick how to proceed.
 *
 * @param  {STATE}  state  Installer state/data
 * @return {string}        Completion status
 */
export const handleExistingInstall = async function (state) {
  if (state.existingVersion) {
    const choice = await select({
      message: 'Found an existing installation of devEngines CLI:',
      options: [
        {
          label: 'Keep it',
          value: 'keep',
          hint: '(exit installer)'
        },
        {
          label: 'Upgrade',
          value: 'upgrade',
          hint: '(keep, but attempt to update it)'
        },
        {
          label: 'Delete it and install a fresh copy',
          value: 'delete'
        },
        {
          label: 'Uninstall',
          value: 'uninstall',
          hint: '(delete and remove "devEngines" from your PATH)'
        }
      ]
    });
    if (choice === 'keep') {
      return 'done';
    }
    const choiceMap = {
      upgrade: attemptUpgrade,
      delete: deleteAndReinstall,
      uninstall: uninstallDevEnginesCli
    };
    return await choiceMap[choice](/* state */);
  }
};
