/**
 * @file Logic for dealing with existing devEngines CLI installs.
 */

import { execSync } from 'node:child_process';
import console from 'node:console';
import { chdir } from 'node:process';

import { select } from '@clack/prompts';

import { logger } from './logger.js';

const __dirname = import.meta.dirname;

/** @typedef {import('../types.js').STATE} STATE */

/**
 * Attempts `git pull` on the installation to get
 * latest code.
 *
 * @param  {STATE}  state  Installer state/data
 * @return {string}        'done'
 */
const attemptUpgrade = async function (state) {
  if (!state.gitInstalled) {
    logger('Git CLI not found, upgrade not possible. Either install git or do a fresh install.');
    return 'done';
  }

  try {
    // cd to the installation
    chdir(state.dotDevEnginesPath);
  } catch {
    logger('Error changing directory to devEngines installation.');
    return 'done';
  }

  try {
    // check `git status` to ensure `main` branch with no changes
    const status = String(execSync('git status'));
    if (!status.includes('On branch main')) {
      logger(
        'The devEngines CLI installation is not based on the main branch. ' +
        'Either manually change it to the main branch or do a fresh install.'
      );
      return 'done';
    }
    if (!status.includes('nothing to commit, working tree clean')) {
      // TODO: Need to stop committing cacheLists folder for this to work
      logger(
        'Your devEngines CLI installation has uncommitted changes. ' +
        'Manually resolve these, or do a fresh install.'
      );
      return 'done';
    }
  } catch {
    logger('Unable to check status prior to updating.');
    return 'done';
  }

  try {
    logger('Updating');
    const result = String(execSync('git pull origin main'));
    console.log(result);
  } catch {
    logger('Issue running `git pull origin main` on .devEngines installation.');
  }

  logger('Update complete.');
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
      message: 'Found an existing installation of devEngines CLI (v' + state.existingVersion +'):',
      options: [
        {
          label: 'Keep it',
          value: 'keep',
          hint: 'exit installer'
        },
        {
          label: 'Upgrade',
          value: 'upgrade',
          hint: 'keep, but attempt to update it'
        },
        {
          label: 'Fresh install',
          value: 'delete',
          hint: 'Delete it, redownload, and reinstall'
        },
        {
          label: 'Uninstall',
          value: 'uninstall',
          hint: 'delete and remove "devEngines" from your PATH'
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
    return await choiceMap[choice](state);
  }
};
