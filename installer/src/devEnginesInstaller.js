/**
 * @file The entry point to the devEngines CLI installer.
 */

import console from 'node:console';

import { handleExistingInstall } from './existingInstall.js';
import { logger } from './logger.js';
import { logo } from './logo.js';
import { initializeState } from './state.js';

const run = async function () {
  console.log(logo);

  const state = await initializeState();
  // Remove later
  console.log({ state });

  const existingOutcome = await handleExistingInstall(state);
  if (existingOutcome === 'done') {
    logger('Done.');
    return;
  }

  /*
  How would you like to download the devEngines CLI?
    Use git clone HTTPS (disabled if unable to find local git)
    Use git clone SSH (disabled if unable to find local git)
    Use GitHub CLI (gh whatever, disabled if not found)
    download a zip over regular HTTPS
  */
  /*
  Downloading/Cloning ........
  Unzipping .........
  Downloading Node v25.5.1......
  Unzipping........
  Running npm i
  Adding to PATH.......
  DONE! It is now safe to exit and delete this installer.
  */
};

run();
