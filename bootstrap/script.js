/**
 * @file Installs devEngines by downloading Node.js and setting up shims.
 */
/* global Bun */

import { spawn } from 'node:child_process';
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { arch, homedir, platform } from 'node:os';
import path from 'node:path';

const __dirname = import.meta.dirname;

/**
 * Read the Node.js version required for devEngines from package.json.
 *
 * @return {string} Node version example: '25.6.1'
 */
function getNodeVersion () {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.devEngines.runtime[0].version;
}

/**
 * Create the Node.js download URL for the current operating system.
 *
 * @param  {string} version  Node.js version
 * @return {string}          Download URL
 */
function createNodeDownloadUrl (version) {
  const os = platform();
  const architecture = arch();

  // Node.js uses 'win' in filenames, not 'win32'
  const osForUrl = os === 'win32' ? 'win' : os;

  // Use different extensions per OS
  const ext = os === 'win32' ? 'zip' : 'tar.gz';

  const url = `https://nodejs.org/dist/v${version}/node-v${version}-${osForUrl}-${architecture}.${ext}`;

  // Example: https://nodejs.org/dist/v25.6.1/node-v25.6.1-darwin-arm64.tar.gz
  console.log('Created URL:', url);

  return url;
}

/**
 * Download a file from a URL to a local path.
 *
 * @param  {string}        url              Node.js download URL
 * @param  {string}        destinationPath  Download destination
 * @return {Promise<void>}
 */
async function downloadNodeFile (url, destinationPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download: ${response.status} ${response.statusText}`
    );
  }

  const buffer = await response.arrayBuffer();
  await Bun.write(destinationPath, buffer);

  console.log('Downloaded to:', destinationPath);
}

/**
 * Extract a .tar.gz archive (Mac/Linux).
 *
 * @param  {string}        archivePath      Archive location
 * @param  {string}        destinationPath  Extraction destination
 * @return {Promise<void>}
 */
async function extractTar (archivePath, destinationPath) {
  return new Promise((resolve, reject) => {
    const tar = spawn('tar', ['-xzf', archivePath, '-C', destinationPath]);

    tar.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`tar exited with code ${code}`));
      }
    });

    tar.on('error', reject);
  });
}

/**
 * Extract a .zip archive (Windows).
 *
 * @param  {string} archivePath      Archive location
 * @param  {string} destinationPath  Extraction destination
 * @return {void}
 */
async function extractZip (archivePath, destinationPath) {
  // Implement Windows later
  console.log('archive:', archivePath);
  console.log('destination:', destinationPath);
  return null;
}

/**
 * Create executable shim files for node, npm, and npx.
 *
 * @return {void}
 */
function createShims () {
  const version = getNodeVersion();
  const os = platform();
  const architecture = arch();
  const osForUrl = os === 'win32' ? 'win' : os;

  const nodeBinDir = path.join(
    __dirname,
    '..',
    'internal-node',
    `node-v${version}-${osForUrl}-${architecture}`,
    'bin'
  );

  const shimsDir = path.join(__dirname, '..', 'shims');
  mkdirSync(shimsDir, { recursive: true });
  const tools = ['node', 'npm', 'npx'];
  for (const tool of tools) {
    if (os === 'win32') {
      // Windows - skip for now
    } else {
      const shimContent = `#!/bin/sh\nexec "${path.join(nodeBinDir, tool)}" "$@"`;
      const shimPath = path.join(shimsDir, tool);
      writeFileSync(shimPath, shimContent);
      chmodSync(shimPath, 0o755);
    }
  }
  console.log('Created shims in:', shimsDir);
}

/**
 * Add the shims folder to the user's PATH.
 *
 * @return {void}
 */
function addShimsToPath () {
  const os = platform();
  const shimsDir = path.join(__dirname, '..', 'shims');

  if (os === 'win32') {
    console.log('Windows implementation not complete. Returning.');
    return;
  }

  // Mac/Linux: Find config file
  const home = homedir();
  const shell = process.env.SHELL || '/bin/bash';
  let configFile;

  if (shell.includes('zsh')) {
    configFile = path.join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    // Check for .bash_profile first (macOS), fallback to .bashrc
    configFile = existsSync(path.join(home, '.bash_profile')) ?
      path.join(home, '.bash_profile') :
      path.join(home, '.bashrc');
  } else {
    configFile = path.join(home, '.profile');
  }

  const exportLine = `\n# devEngines\nexport PATH="${shimsDir}:$PATH"\n`;
  console.log('exportLine', exportLine);

  // Check if already added
  if (existsSync(configFile)) {
    const content = readFileSync(configFile, 'utf-8');
    if (content.includes('devEngines')) {
      console.log('PATH already configured in:', configFile);
      return;
    }
  }

  appendFileSync(configFile, exportLine);
  console.log('Added to PATH in:', configFile);
  console.log('\nRestart your terminal or run:');
  console.log(`  source ${configFile}`);
}

/**
 * Remove the shims folder from the user's PATH.
 *
 * @return {void}
 */
function removeShimsFromPath () {
  const os = platform();

  if (os === 'win32') {
    console.log('Remove the devEngines shims folder from your PATH manually.');
    return;
  }

  // Check config files
  const home = homedir();
  const configFiles = [
    path.join(home, '.zshrc'),
    path.join(home, '.bashrc'),
    path.join(home, '.bash_profile'),
    path.join(home, '.profile')
  ];

  for (const configFile of configFiles) {
    if (!existsSync(configFile)) {
      continue;
    }

    const content = readFileSync(configFile, 'utf-8');
    if (content.includes('devEngines')) {
      // Remove the devEngines lines
      const newContent = content
        .split('\n')
        .filter((line) => !line.includes('devEngines'))
        .join('\n');

      writeFileSync(configFile, newContent);
      console.log('Removed from:', configFile);
    }
  }

  console.log('\nRestart your terminal to complete uninstallation.');
}

/**
 * Main install function - downloads Node.js, extracts it, and sets up shims.
 *
 * @return {Promise<void>}
 */
async function install () {
  console.log('Installing devEngines... \n');

  const os = platform();
  const version = getNodeVersion();
  const url = createNodeDownloadUrl(version);
  const ext = os === 'win32' ? 'zip' : 'tar.gz';

  // Create directories
  const cacheDir = path.join(__dirname, '..', 'cache');
  const internalNodeDir = path.join(__dirname, '..', 'internal-node');
  mkdirSync(cacheDir, { recursive: true });
  mkdirSync(internalNodeDir, { recursive: true });

  // Download
  const archivePath = path.join(cacheDir, `node-v${version}.${ext}`);
  if (!existsSync(archivePath)) {
    await downloadNodeFile(url, archivePath);
  } else {
    console.log('Using cached:', archivePath);
  }

  // Extract
  console.log('Extracting...');
  if (os === 'win32') {
    extractZip(archivePath, internalNodeDir);
  } else {
    await extractTar(archivePath, internalNodeDir);
  }

  // Create shims
  createShims();

  // Add to PATH
  addShimsToPath();

  console.log('\nInstallation complete!');
}

// CLI entry point
const command = process.argv[2];

if (command === 'install') {
  install();
} else if (command === 'uninstall') {
  removeShimsFromPath();
  console.log('\nUninstallation complete!');
} else {
  console.log('devEngines Bootstrap');
  console.log('');
  console.log('OS:', platform());
  console.log('Arch:', arch());
  console.log('Help:');
  console.log('bun bootstrap/script.js install    Install devEngines');
  console.log('bun bootstrap/script.js uninstall  Uninstall devEngines');
}
