import { logger } from '@@@/src/logger.js';

describe('Logger', () => {
  test('Logs message', () => {
    logger('Text');

    expect(console.log)
      .toHaveBeenCalledWith('DEVENGINES CLI INSTALLER: Text');
  });
});
