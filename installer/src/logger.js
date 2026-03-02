/**
 * @file Centralized logging function.
 */

import console from 'node:console';

/**
 * Centralized logging function.
 *
 * @param {string} message  Any message to be logged to the console
 */
export const logger = function (message) {
  console.log('DEVENGINES CLI INSTALLER: ' + message);
};
