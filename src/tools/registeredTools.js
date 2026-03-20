/**
 * @file Simplifies interacting with the different registered tools.
 */

import node from './node.js';
import npm from './npm.js';
import unsupported from './unsupportedTool.js';

/** @typedef {import('../types.js').TOOL} TOOL */

/**
 * Resolves a version number to the exact version for a specific tool.
 *
 * @param  {TOOL}   tool            Tool name ('node', 'npm', etc)
 * @param  {string} desiredVersion  The unresolved tool version
 * @return {string}                 The resolved exact version
 */
export const resolveToolVersion = async function (tool, desiredVersion) {
  const toolMap = {
    node,
    npm
  };
  const toolHelpers = toolMap[tool] || unsupported;
  const resolvedVersion = await toolHelpers.resolveVersion(desiredVersion);
  return resolvedVersion;
};
