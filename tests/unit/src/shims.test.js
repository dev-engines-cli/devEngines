import { execSync } from 'node:child_process';

import {
  LATEST_NODE
  // LATEST_NPM
} from '@@/data/constants.js';

describe('shims.js', () => {
  test('Run node -v', () => {
    let stdout;
    try {
      stdout = String(execSync('./shims/node -v')).trim();
    } catch (error) {
      console.log('Error:' + error.toString());
    }

    expect(stdout)
      .toEqual([
        'Download and install: node@' + LATEST_NODE,
        '[ \'-v\' ]'
      ].join('\n'));
  });

  test('Run npm -v', () => {
    let stdout;
    try {
      stdout = String(execSync('./shims/npm -v')).trim();
    } catch (error) {
      console.log('Error:' + error.toString());
    }

    expect(stdout)
      .toEqual([
        'Download and install: npm@11.11.0',
        '[ \'-v\' ]'
      ].join('\n'));
  });
});
