/**
 * @file Reusable test constants
 */

export const CLI_VERSION = 'v0.0.1';

export const HELP_MENU = [
  'devEngines CLI ' + CLI_VERSION,
  'Node and npm version switching and pinning',
  '',
  'Updating all versions in the local package.json',
  '  devEngines lts',
  '  devEngines latest',
  '',
  'Globally update all versions (fallback if local tool version not found)',
  '  devEngines -g lts',
  '  devEngines -g latest',
  '',
  'Pinning a specific tool locally',
  '  devEngines [toolname]@[version]',
  '  devEngines node@lts',
  '  devEngines node@latest',
  '  devEngines node@24.0.0',
  '  devEngines node@24',
  '  devEngines npm@latest',
  '  etc.',
  '',
  'Pinning a specific tool globally (fallback if local tool version not found)',
  '  devEngines -g [toolname]@[version]',
  '  devEngines -g node@lts',
  '  etc.',
  '',
  'Clearing local cache of tool version downloads',
  '  devEngines purge',
  '',
  'Get the devEngines CLI version',
  '  devEngines -v'
].join('\n');

export const npmReleasesDummyData = Object.freeze({
  date: 1773450000000,
  data: [
    '11.12.0',
    '11.0.0',
    '11.0.0-pre.0',
    '10.9.7',
    '10.0.0',
    '10.0.0-pre.0',
    '9.9.4',
    '9.0.0',
    '9.0.0-pre.6',
    '9.0.0-pre.0',
    '8.19.4',
    '8.0.0',
    '7.24.2',
    '7.0.0',
    '7.0.0-rc.4',
    '7.0.0-rc.0',
    '7.0.0-beta.13',
    '7.0.0-beta.0',
    '6.14.18',
    '6.0.0',
    '6.0.0-next.2',
    '6.0.0-next.1',
    '6.0.0-next.0',
    '5.10.0',
    '5.10.0-next.1',
    '5.10.0-next.0',
    '5.0.0',
    '4.6.1',
    '4.0.0',
    '3.10.10',
    '3.0.0',
    '2.15.12',
    '2.0.0',
    '2.0.0-beta.1',
    '2.0.0-beta.0',
    '2.0.0-alpha-5',
    '2.0.0-alpha.7',
    '2.0.0-alpha.6.0',
    '2.0.0-alpha.6',
    '1.5.0-alpha-0',
    '1.4.29',
    '1.2.8000',
    '1.2.32',
    '1.1.25'
  ]
});
export const nodeReleasesDummyData = Object.freeze({
  date: 1773450000000,
  data: [
    {
      version: '25.8.1',
      date: '2026-03-10',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-arm64-7z',
        'win-arm64-zip',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip'
      ],
      npm: '11.11.0',
      lts: false
    },
    {
      version: '25.0.0',
      date: '2025-10-15',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-arm64-7z',
        'win-arm64-zip',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip'
      ],
      npm: '11.6.2',
      lts: false
    },
    {
      version: '24.14.0',
      date: '2026-02-24',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-arm64-7z',
        'win-arm64-zip',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip'
      ],
      npm: '11.9.0',
      lts: 'Krypton'
    },
    {
      version: '24.0.0',
      date: '2025-05-06',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-arm64-7z',
        'win-arm64-zip',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip'
      ],
      npm: '11.3.0',
      lts: false
    },
    {
      version: '22.0.0',
      date: '2024-04-24',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-armv7l',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-arm64-7z',
        'win-arm64-zip',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip',
        'win-x86-7z',
        'win-x86-exe',
        'win-x86-msi',
        'win-x86-zip'
      ],
      npm: '10.5.1',
      lts: false
    },
    {
      version: '20.0.0',
      date: '2023-04-17',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-armv7l',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-arm64-7z',
        'win-arm64-zip',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip',
        'win-x86-7z',
        'win-x86-exe',
        'win-x86-msi',
        'win-x86-zip'
      ],
      npm: '9.6.4',
      lts: false
    },
    {
      version: '18.0.0',
      date: '2022-04-18',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-armv7l',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip'
      ],
      npm: '8.6.0',
      lts: false
    },
    {
      version: '16.0.0',
      date: '2021-04-20',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-armv7l',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'osx-arm64-tar',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip',
        'win-x86-7z',
        'win-x86-exe',
        'win-x86-msi',
        'win-x86-zip'
      ],
      npm: '7.10.0',
      lts: false
    },
    {
      version: '8.0.0',
      date: '2017-05-30',
      files: [
        'aix-ppc64',
        'headers',
        'linux-arm64',
        'linux-armv6l',
        'linux-armv7l',
        'linux-ppc64le',
        'linux-s390x',
        'linux-x64',
        'linux-x86',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'sunos-x64',
        'sunos-x86',
        'win-x64-7z',
        'win-x64-exe',
        'win-x64-msi',
        'win-x64-zip',
        'win-x86-7z',
        'win-x86-exe',
        'win-x86-msi',
        'win-x86-zip'
      ],
      npm: '5.0.0',
      lts: false
    },
    {
      version: '6.0.0',
      date: '2016-04-26',
      files: [
        'headers',
        'linux-arm64',
        'linux-armv6l',
        'linux-armv7l',
        'linux-ppc64le',
        'linux-x64',
        'linux-x86',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'sunos-x64',
        'sunos-x86',
        'win-x64-exe',
        'win-x64-msi',
        'win-x86-exe',
        'win-x86-msi'
      ],
      npm: '3.8.6',
      lts: false
    },
    {
      version: '4.0.0',
      date: '2015-09-08',
      files: [
        'headers',
        'linux-arm64',
        'linux-armv6l',
        'linux-armv7l',
        'linux-x64',
        'linux-x86',
        'osx-x64-pkg',
        'osx-x64-tar',
        'src',
        'sunos-x64',
        'sunos-x86',
        'win-x64-exe',
        'win-x64-msi',
        'win-x86-exe',
        'win-x86-msi'
      ],
      npm: '2.14.2',
      lts: false
    },
    {
      version: '0.12.18',
      date: '2017-02-22',
      files: [
        'headers',
        'linux-x64',
        'linux-x86',
        'osx-x64-pkg',
        'osx-x64-tar',
        'osx-x86-tar',
        'src',
        'sunos-x86',
        'win-x64-exe',
        'win-x86-exe',
        'win-x86-msi'
      ],
      npm: '2.15.11',
      lts: false
    },
    {
      version: '0.10.0',
      date: '2013-03-11',
      files: [
        'linux-x64',
        'linux-x86',
        'osx-x64-pkg',
        'osx-x64-tar',
        'osx-x86-tar',
        'src',
        'sunos-x64',
        'sunos-x86',
        'win-x64-exe',
        'win-x86-exe',
        'win-x86-msi'
      ],
      npm: '1.2.14',
      lts: false
    },
    {
      version: '0.9.0',
      date: '2012-07-20',
      files: [
        'osx-x64-pkg',
        'src',
        'win-x64-exe',
        'win-x86-exe',
        'win-x86-msi'
      ],
      npm: '1.1.44',
      lts: false
    },
    {
      version: '0.8.0',
      date: '2012-06-22',
      files: [
        'osx-x64-pkg',
        'src',
        'win-x64-exe',
        'win-x86-exe',
        'win-x86-msi'
      ],
      npm: '1.1.32',
      lts: false
    },
    {
      version: '0.7.0',
      date: '2012-01-17',
      files: [
        'osx-x64-pkg',
        'src',
        'win-x86-exe'
      ],
      npm: '1.1.0-2',
      lts: false
    },
    {
      version: '0.6.0',
      date: '2011-11-04',
      files: [
        'src',
        'win-x86-exe'
      ],
      lts: false
    },
    {
      version: '0.5.0',
      date: '2011-08-26',
      files: ['src'],
      lts: false
    },
    {
      version: '0.4.0',
      date: '2011-08-26',
      files: ['src'],
      lts: false
    },
    {
      version: '0.3.0',
      date: '2011-08-26',
      files: ['src'],
      lts: false
    },
    {
      version: '0.2.0',
      date: '2011-08-26',
      files: ['src'],
      lts: false
    },
    {
      version: '0.1.14',
      date: '2011-08-26',
      files: ['src'],
      lts: false
    }
  ]
});
export const LATEST_NODE = nodeReleasesDummyData.data[0].version;
export const LATEST_NPM = npmReleasesDummyData.data[0];
