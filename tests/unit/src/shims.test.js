import { execSync } from 'node:child_process';

describe('shims.js', () => {
  test('Run node -v', () => {
    let stdout;
    try {
      stdout = String(execSync('./shims/node -v')).trim();
    } catch (error) {
      console.log('Error:' + error.toString());
    }

    expect(stdout)
      .toMatchInlineSnapshot(`
        "Download and install: node@26.13.0
        [ '-v' ]"
      `);
  });

  test('Run npm -v', () => {
    let stdout;
    try {
      stdout = String(execSync('./shims/npm -v')).trim();
    } catch (error) {
      console.log('Error:' + error.toString());
    }

    expect(stdout)
      .toMatchInlineSnapshot(`
        "Download and install: npm@12.2.2
        [ '-v' ]"
      `);
  });
});
