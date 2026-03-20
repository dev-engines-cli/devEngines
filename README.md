
## WIP

> The following is an API mockup, the code for it is not fully implemented.


# devEngines CLI

JavaScript tooling management.

* **Fully automatic**
  * Automatically switches to the correct Node/npm version required by your project.
  * Downloads the Node/npm versions automatically on first use.
  * It is impossible to be on the wrong version.
* **Standards compliant**
  * Uses the official "[devEngines](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines)" standard in the `package.json`.
    * *Used by npm, pnpm, corepack, etc.*
  * The `npm` executable will throw an error if the version used does not match what is defined in the "devEngines" part of the `package.json`.
* **Focused**
  * Exclusively supports JavaScript tooling.
    * Currently just Node and npm, but eventually Deno, Bun, PNPM, and Yarn also.
  * Streamlined CLI API.
* **Cross-Platform**
  * Works the same for everyone on your team.
  * One set of setup instructions for everyone.
  * Runs anywhere Node runs.
* **Long-term reliability**
  * Open source (MIT licensed)
  * Written in JS
  * Can easily be maintained by the JS community
* **100% Test Coverage**


## CLI Commands

* `devEngines lts`
  * Update all tools listed in the `devEngines` of the local `package.json` to a resolved exact version of the most recent LTS release, or latest release if the tool does not have an LTS version.
* `devEngines latest`
  * Updates the tools listed in the `devEngines` to a resolved exact version of the latest releases
* Pin tool to a resolved version
  * **Syntax:** `devEngines [toolname]@[version]`
  * **Examples:**
    * `devEngines node@latest`
    * `devEngines node@lts`
    * `devEngines node@24`
    * `devEngines node@24.0.0`
    * `devEngines npm@latest`
    * `devEngines npm@11`
    * `devEngines npm@11.0.0`
* Use any of the following to set a global fallback to use if `devEngines` are not defined in the local `package.json`, or there is no `package.json` to be found.
  * `devEngines -g latest`
  * `devEngines -g lts`
  * `devEngines -g node@latest`
  * `devEngines -g node@lts`
  * `devEngines -g node@24`
  * `devEngines -g node@24.0.0`
  * `devEngines -g npm@latest`
* Delete all cached tool (Node/npm) versions
  * `devEngines purge`
* CLI version
  * `devEngines -v`
* Help menu
  * `devEngines --help`


## Installation:

1. Before installation, remove Node and npm if they are globally installed. Also remove any existing Node version management tools (nvm, n, nodist, nvm-windows, volta, proto, etc).
1. In a command prompt or terminal change to the user profile home directory:
   * **Windows:** `cd %USERPROFILE%`
   * **Linux/OSX:** `cd ~`
1. Clone the repo with one of these commands:
   * **HTTPS:** `git clone https://github.com/TheJaredWilcurt/devEngines.git`
   * **SSH:** `git@github.com:TheJaredWilcurt/devEngines.git`
   * **GitHub CLI:** `gh repo clone TheJaredWilcurt/devEngines`
1. Change directory into the cloned repo:
   * `cd devEngines`
1. Install
   * **Windows:** `install.bat`
   * **Linux/OSX:** `./install.sh`
   * This downloads a local copy of Node.js used exclusively by the devEngines CLI.
   * It also adds folders to the PATH related to the devEngines CLI.


## Usage

1. In your repos, delete any existing Node/npm stored version that are not in the official `"devEngines"` location:
   * `.nvmrc`
   * `.node-version`
   * `mise.toml`
   * `.prototools`
   * `volta` object in the `package.json`
   * etc
1. Run one of the devEngines CLI commands documented above to pin Node/npm to the desired versions.
1. Any time you want to update the Node or npm versions, you can run the `devEngines lts` command.


## Uninstalling

1. In a command prompt or terminal change to the cloned devEngines repo directory:
   * **Windows:** `cd %USERPROFILE%\devEngines`
   * **Linux/OSX:** `cd ~/devEngines`
1. Uninstall
   * **Windows:** `uninstall.bat`
   * **Linux/OSX:** `./uninstall.sh`
   * This removes folders from the PATH related to the devEngines CLI
1. Go up a directory
   * `cd ..`
1. Delete the cloned repo
   * **Windows:** `rd /s /q devEngines`
   * **Linux/OSX:** `rm -r -f ./devEngines`


* * *


## Tasks:

Tracking the project's progress.

* [ ] Installer:
  * [ ] Needs unit tests for existing code (`/tests/unit/installer/*`)
  * [ ] Handle existing installs of devEngines CLI
    * [x] keep
    * [x] upgrade
    * [ ] delete
    * [ ] uninstall
  * [ ] Offer download Options:
    * [ ] git clone HTTPS
    * [ ] git clone SSH
    * [ ] GitHub CLI
    * [ ] https zip download options
  * [ ] Clone repo or Download+Unzip
  * [ ] Download/unzip correct Node version for the CLI
  * [ ] Run `npm i`
  * [ ] Add to PATH
  * [ ] Remove from PATH (for uninstalls)
  * [ ] Installation documentation
* [ ] CLI
  * [x] Maintain 100% test coverage
  * [x] Output version number
  * [x] Show help menu
  * [x] Pin the node or npm version locally
    * [x] Download/cache list of available versions
    * [x] Resolve version
    * [x] Find manifest
      * [ ] Handle monorepos
    * [x] Update manifest devEngines
    * [x] Get list of tools and their versions from devEngines
  * [ ] Create Node/npm shims
    * [ ] node
    * [ ] npm
    * [ ] npx
    * [ ] node-gyp
  * [ ] Download/unzip correct Node/npm versions
  * [ ] Run original command with arguments through the shim
  * [ ] Purge tool downloads (`devEngines purge`)
