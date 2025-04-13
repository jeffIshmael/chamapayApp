// this file contains functions to get the transaction fee(gas + tx fee) for a given amount
// for tx fee, we charge 1% of the amount
const { createPublicClient, http, erc20Abi, formatEther, parseEther } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { celoAlfajores } = require("viem/chains");

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
const chamapayContractAddress = "0xaaC8431C5401aF70cD802492A3e133667873c4Da";

// gets the gas fees to execute a transfer tx
const getGasFee = async (amount, privateKey) => {
  const account = privateKeyToAccount(privateKey);
  //   const txFee = Number(amount) * 0.01; // charging 1% of the amount
  try {
    const gas = await publicClient.estimateContractGas({
      address: cUSDContractAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [chamapayContractAddress, parseEther(amount)],
      account,
      feeCurrency: cUSDContractAddress,
    });
    return formatEther(gas);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { getGasFee };
