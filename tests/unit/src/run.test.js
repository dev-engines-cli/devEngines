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
  const runAsGlobal = true;

  describe('run', () => {
    describe('Global installs', () => {
      test('Global without argument', async () => {
        await run(runAsGlobal);

        expect(console.log)
          .toHaveBeenCalledWith('Missing an argument after -g');
      });

      test('Global with argument', async () => {
        await run(runAsGlobal, 'node@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Successfully updated global Node version to ' + LATEST_NODE);

        // TODO: Remove after mocking fs
        resetGlobalToolsFile();
      });
    });

    describe('Version number', () => {
      const version = 'devEngines ' + CLI_VERSION;

      test('Argument --version', async () => {
        await run(!runAsGlobal, '--version');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });

      test('Argument -v', async () => {
        await run(!runAsGlobal, '-v');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });

      test('Argument v', async () => {
        await run(!runAsGlobal, 'v');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });

      test('Argument version', async () => {
        await run(!runAsGlobal, 'version');

        expect(console.log)
          .toHaveBeenCalledWith(version);
      });
    });

    describe('Update all tools', () => {
      test('Pin local to LTS', async () => {
        await run(!runAsGlobal, 'lts');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local to LTS');
      });

      test('Pin local to Latest', async () => {
        await run(!runAsGlobal, 'latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local to latest');
      });

      test('Pin global to LTS', async () => {
        await run(runAsGlobal, 'lts');

        expect(console.log)
          .toHaveBeenCalledWith('Pin global to LTS');
      });

      test('Pin global to latest', async () => {
        await run(runAsGlobal, 'latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin global to latest');
      });
    });

    describe('Update Node', () => {
      test('Run devEngines node@latest', async () => {
        await run(!runAsGlobal, 'node@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local Node to ' + LATEST_NODE);
      });

      test('Run devEngines node@', async () => {
        await run(!runAsGlobal, 'node@');

        expect(console.log)
          .toHaveBeenCalledWith(helpMessage);
      });
    });

    describe('Update npm', () => {
      test('Run devEngines npm@latest', async () => {
        await run(!runAsGlobal, 'npm@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local npm to ' + LATEST_NPM);
      });

      test('Run devEngines npm@', async () => {
        await run(!runAsGlobal, 'npm@');

        expect(console.log)
          .toHaveBeenCalledWith(helpMessage);
      });
    });

    test('Unsupported tool', async () => {
      await run(!runAsGlobal, 'bun@1.0.0');

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
