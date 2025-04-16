// this file contains functions to get the transaction fee(gas + tx fee) for a given amount
// for tx fee, we charge 1% of the amount
const {
  createPublicClient,
  http,
  erc20Abi,
  formatEther,
  parseEther,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { celo } = require("viem/chains");
const {
  chamapayContractAddress,
  cKESContractAddress,
} = require("../constants/contractAddress");
const {getFeeCurrency} = require("../constants/feeCurrency");

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

// gets the gas fees to execute a transfer tx
const getGasFee = async (amount, privateKey) => {
  const account = privateKeyToAccount(privateKey);
  //   const txFee = Number(amount) * 0.01; // charging 1% of the amount
  const amountToUse = parseEther(amount);
  try {
    const gas = await publicClient.estimateContractGas({
      address: cKESContractAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [chamapayContractAddress, amountToUse],
      account,
      feeCurrency: getFeeCurrency(),
    });
    return formatEther(gas);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { getGasFee };
