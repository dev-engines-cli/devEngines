/**
 * @file Generic helper functions used across files.
 */

import {
  existsSync,
  readFileSync
} from 'node:fs';

/** @typedef {import('./types.js').TOOL} TOOL */

/**
 * Detects CRLF, CR, or LF line endings in a string and
 * returns what it found.
 *
 * @param  {string}           string  Any string, presumed read from file
 * @return {'\r\n'|'\r'|'\n'}         The first line ending found, fallsback to \n
 */
export const determineEndOfLineCharacter = function (string) {
  if (string.includes('\r\n')) {
    return '\r\n';
  }
  if (string.includes('\r')) {
    return '\r';
  }
  return '\n';
};

/**
 * Detects the amount of indentation used in a string.
 *
 * @param  {string}      string  Any string, presumed read from file
 * @return {number|'\t'}         The number or spaces or '\t' for tab
 */
export const determineIndentation = function (string) {
  const eol = determineEndOfLineCharacter(string);
  const firstIndentedLine = string
    .split(eol)
    .find((line) => {
      return (
        line.startsWith('\t') ||
        line.startsWith(' ')
      );
    });

  if (firstIndentedLine) {
    if (firstIndentedLine.startsWith('\t')) {
      return '\t';
    }
    const characters = firstIndentedLine.split('');
    let spaceCount = 0;
    let nonSpaceFound = false;
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      if (character !== ' ') {
        nonSpaceFound = true;
      }
      if (!nonSpaceFound) {
        spaceCount = spaceCount + 1;
      }
    }
    return spaceCount;
  }
  return 2;
};

/**
 * @typedef  {object}   CACHEDDATA
 * @property {number}   date        The timestamp of when the data was last cached
 * @property {object[]} data        The cached data
 */

/**
 * Checks if the file exists, reads it, returns it as parsed JSON.
 *
 * @param  {string}     filePath  The location of the JSON file to load
 * @return {CACHEDDATA}           The loaded data
 */
export const loadJsonFile = function (filePath) {
  let fileExists = false;
  try {
    fileExists = existsSync(filePath);
  } catch {
    // do nothing
  }
  let data;
  if (fileExists) {
    try {
      const contents = readFileSync(filePath);
      data = JSON.parse(contents);
    } catch {
      // do nothing
    }
  }
  return data;
};

/**
 * Takes in a lowercase tool name and returns it as the officially
 * cased brand orthography.
 *
 * @param  {TOOL}   tool  Lowercase tool name
 * @return {string}       Title case tool name
 */
export const getToolTitleCase = function (tool) {
  const titleMap = {
    bun: 'Bun',
    deno: 'Deno',
    node: 'Node',
    npm: 'npm',
    pnpm: 'PNPM',
    yarn: 'Yarn'
  };
  return titleMap[tool] || tool;
};

/**
 * This prevents making network calls to API's when we have
 * a recently cached local version that could be used.
 *
 * @type {number}
 */
export const API_COOL_DOWN = 10 * 1000;

export const supportedRuntimes = Object.freeze([
  'node',
  'deno',
  'bun'
]);
export const supportedPackageManagers = Object.freeze([
  'npm',
  'bun',
  'pnpm',
  'yarn'
]);
export const supportedTools = Object.freeze(Array.from(new Set([
  ...supportedRuntimes,
  ...supportedPackageManagers
])));
