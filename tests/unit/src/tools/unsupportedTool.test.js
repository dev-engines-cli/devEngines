import tool, { message } from '@/tools/unsupportedTool.js';

describe('unsupportedTools.js', () => {
  test('Stub getCachedReleases', async () => {
    await tool.getCachedReleases();

    expect(console.log)
      .toHaveBeenCalledWith(message);
  });

  test('Stub getLatestReleases', async () => {
    await tool.getLatestReleases();

    expect(console.log)
      .toHaveBeenCalledWith(message);
  });

  test('Stub resolveVersion', async () => {
    await tool.resolveVersion();

    expect(console.log)
      .toHaveBeenCalledWith(message);
  });
});
