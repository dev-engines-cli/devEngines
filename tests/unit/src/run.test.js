import { helpMessage } from '@/helpMenu.js';
import { run, updateAllTools } from '@/run.js';

import {
  CLI_VERSION,
  HELP_MENU,
  LATEST_NODE,
  LATEST_NPM
} from '@@/data/constants.js';
import { resetGlobalToolsFile } from '@@/unit/testHelpers.js';

describe('run.js', () => {
  describe('run', () => {
    describe('Global installs', () => {
      test('Global without argument', async () => {
        const isGlobal = true;
        await run(isGlobal);

        expect(console.log)
          .toHaveBeenCalledWith('Missing an argument after -g');
      });

      test('Global with argument', async () => {
        const isGlobal = true;
        await run(isGlobal, 'node@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Successfully updated global Node version to ' + LATEST_NODE);

        // TODO: Remove after mocking fs
        resetGlobalToolsFile();
      });
    });

    describe('Version number', () => {
      const version = 'devEngines ' + CLI_VERSION;

      test('Argument --version', async () => {
        const isGlobal = false;
        await run(isGlobal, '--version');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });

      test('Argument -v', async () => {
        const isGlobal = false;
        await run(isGlobal, '-v');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });

      test('Argument v', async () => {
        const isGlobal = false;
        await run(isGlobal, 'v');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });

      test('Argument version', async () => {
        const isGlobal = false;
        await run(isGlobal, 'version');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });
    });

    describe('Update all tools', () => {
      test('Pin local to LTS', async () => {
        const isGlobal = false;
        await run(isGlobal, 'lts');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local to LTS');
      });

      test('Pin local to Latest', async () => {
        const isGlobal = false;
        await run(isGlobal, 'latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local to latest');
      });

      test('Pin global to LTS', async () => {
        const isGlobal = true;
        await run(isGlobal, 'lts');

        expect(console.log)
          .toHaveBeenCalledWith('Pin global to LTS');
      });

      test('Pin global to latest', async () => {
        const isGlobal = true;
        await run(isGlobal, 'latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin global to latest');
      });
    });

    describe('Update Node', () => {
      test('Run devEngines node@latest', async () => {
        const isGlobal = false;
        await run(isGlobal, 'node@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local Node to ' + LATEST_NODE);
      });

      test('Run devEngines node@', async () => {
        const isGlobal = false;
        await run(isGlobal, 'node@');

        expect(console.log)
          .toHaveBeenCalledWith(helpMessage);
      });
    });

    describe('Update npm', () => {
      test('Run devEngines npm@latest', async () => {
        const isGlobal = false;
        await run(isGlobal, 'npm@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local npm to ' + LATEST_NPM);
      });

      test('Run devEngines npm@', async () => {
        const isGlobal = false;
        await run(isGlobal, 'npm@');

        expect(console.log)
          .toHaveBeenCalledWith(helpMessage);
      });
    });

    test('Unsupported tool', async () => {
      const isGlobal = false;
      await run(isGlobal, 'bun@1.0.0');

      expect(console.log)
        .toHaveBeenCalledWith('Tool unsupported');
    });

    test('Fallback to help menu', async () => {
      await run();

      expect(console.log)
        .toHaveBeenCalledWith(HELP_MENU);
    });
  });

  describe('updateAllTools', () => {
    test('Logs nothing if arg is not lts or latest', () => {
      updateAllTools('asdf');

      expect(console.log)
        .not.toHaveBeenCalled();
    });
  });
});
