/**
 * @file Stores and caches all the file/folder paths used by devEnginesCLI.
 */

import { join } from 'node:path';

// Folders
const root = join(import.meta.dirname, '..');
const cacheLists = join(root, 'cacheLists');
const localNode = join(root, 'localNode');
const tools = join(root, 'tools');
const nodeInstalls = join(tools, 'node');
const npmInstalls = join(tools, 'npm');

export const folders = {
  cacheLists,
  localNode,
  nodeInstalls,
  npmInstalls,
  root,
  tools
};

// Files
const cachedNpmVersions = join(cacheLists, 'npmVersions.json');
const cachedNodeVersions = join(cacheLists, 'nodeVersions.json');
const globalTools = join(root, 'globalTools.json');
const projectManifest = join(root, 'package.json');

export const files = {
  cachedNpmVersions,
  cachedNodeVersions,
  globalTools,
  projectManifest
};
