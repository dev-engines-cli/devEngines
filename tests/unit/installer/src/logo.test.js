import { logo } from '@@@/src/logo.js'

describe('CLI Logo', () => {
  test('CLI name exists in logo', () => {
    expect(typeof(logo))
      .toEqual('string');

    expect(logo.includes('devEngines CLI Installer'))
      .toEqual(true);
  });
});
