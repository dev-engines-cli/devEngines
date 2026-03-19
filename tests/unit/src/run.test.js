import axios from 'axios';
import { fs, vol } from 'memfs';

import { run, updateAllTools } from '@/run.js';

import {
  CLI_VERSION,
  HELP_MENU,
  LATEST_NODE,
  LATEST_NPM
} from '@@/data/constants.js';
import {
  makeCacheListFolder,
  makeGlobalToolsDummyData,
  makeProjectManifest,
  mockNodeReleases,
  mockNpmReleases
} from '@@/unit/testHelpers.js';

vi.mock('node:fs', () => {
  return fs;
});
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  };
});
makeProjectManifest(vol);
const mockedAxiosGet = vi.mocked(axios.get);

describe('run.js', () => {
  const runAsGlobal = true;

  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
    makeProjectManifest(vol);
  });

  describe('run', () => {
    describe('Global installs', () => {
      test('Global without argument', async () => {
        await run(runAsGlobal);

        expect(console.log)
          .toHaveBeenCalledWith('Missing an argument after -g');
      });

      test('Global with argument', async () => {
        mockNodeReleases(mockedAxiosGet);
        makeCacheListFolder(vol);
        makeGlobalToolsDummyData(vol);

        await run(runAsGlobal, 'node@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Successfully updated global Node version to ' + LATEST_NODE);
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
        mockNodeReleases(mockedAxiosGet);
        makeCacheListFolder(vol);

        await run(!runAsGlobal, 'node@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local Node to ' + LATEST_NODE);
      });

      test('Run devEngines node@ without version', async () => {
        await run(!runAsGlobal, 'node@');

        expect(console.log)
          .toHaveBeenCalledWith(HELP_MENU);
      });
    });

    describe('Update npm', () => {
      test('Run devEngines npm@latest', async () => {
        mockNpmReleases(mockedAxiosGet);
        makeCacheListFolder(vol);

        await run(!runAsGlobal, 'npm@latest');

        expect(console.log)
          .toHaveBeenCalledWith('Pin local npm to ' + LATEST_NPM);
      });

      test('Run devEngines npm@', async () => {
        await run(!runAsGlobal, 'npm@');

        expect(console.log)
          .toHaveBeenCalledWith(HELP_MENU);
      });
    });

    test('Unsupported tool', async () => {
      // TODO: The "unsupportTool" stuff is just a stub until
      //       Deno, Bun, Yarn, PNPM can all be support.
      //       Once that is the case this test, that file,
      //       and code related to it, can be removed.
      await run(!runAsGlobal, 'yarn@1.0.0');

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
