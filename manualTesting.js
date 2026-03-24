/**
 * @file Temp file to manually test download/unzip/progress bar code.
 */

import { download } from '@guoyunhe/downloader';
import { ProgressBar } from 'progress-bar-capture';

const downloadAndUnzip = async function () {
  const progressBar = new ProgressBar({
  });
  // Some servers give you a total size usable to get a percent
  const url = 'https://nodejs.org/dist/v24.14.0/node-v24.14.0-linux-x64.tar.xz';
  // Some don't and all you have is the total bytes downloaded so far
  // const url = 'https://github.com/nodejs/node/archive/refs/tags/v24.14.0.tar.gz';
  const output = './output';
  let initialized = false;
  let fallbackPrinted = false;
  const options = {
    extract: false,
    onProgress: async function (progress) {
      if (progress.totalBytes) {
        if (!initialized) {
          await progressBar.start().update(0);
        }
        await progressBar.update(progress.percentage);
      } else if (!fallbackPrinted) {
        fallbackPrinted = true;
        console.log('Download started, this may take a while');
      }
    }
  };
  await download(url, output, options);
  if (initialized) {
    await progressBar.update(100).finish();
  }
};

console.log('START');
await downloadAndUnzip();
console.log('DONE');
