export async function getBlockRange(provider) {
  try {
    const blockRange = {
      previousEndBlock: 29021797,
      latestBlock: 29222866,
      // latestBlock: async () => {
      //   await provider.getBlockNumber();
      // },
    };

    return blockRange;
  } catch (error) {
    console.error('❌ blockRange()', error);
  }
}
