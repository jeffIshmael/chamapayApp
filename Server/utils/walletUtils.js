// this file has all blockchain write functions

const { ethers } = require("ethers");
const {
  createPublicClient,
  http,
  createWalletClient,
  parseEther,
  erc20Abi,
  formatEther,
  getContract,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const chamaPayAbi = require("../abis/chamapay.json");
const { celo } = require("viem/chains");
const {
  chamapayContractAddress,
  cKESContractAddress,
} = require("../constants/contractAddress");
const { getFeeCurrency } = require("../constants/feeCurrency");
require("dotenv").config();

// const cKESContractAddress = "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0";
const aiAgentPrivateKey = process.env.AI_AGENT_PRIVATE_KEY;

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: celo,
  transport: http(),
});

const contract = getContract({
  address: cKESContractAddress,
  abi: erc20Abi,
  client: publicClient,
  feeCurrency: getFeeCurrency(),
});

//function to get the latest nonce of an address
const getLatestNonce = async (userAddress) => {
  try {
    const latestNonce = await publicClient.getTransactionCount({
      address: userAddress,
      blockTag: "pending", // Check pending transactions
    });
    return latestNonce;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to create chama
const registerChama = async (privateKey, arguments) => {
  const account = privateKeyToAccount(privateKey);
  let nonceToUse;
  try {
    const latestNonce = await getLatestNonce(account.address);
    console.log(`latest nonce: ${latestNonce}`);
    if (!latestNonce) {
      return null;
    }
    nonceToUse = latestNonce + 1;
    console.log(`nonce to use: ${nonceToUse}`);
    console.log("simulating contract...");
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "registerChama",
      args: [
        arguments.amount,
        arguments.duration,
        arguments.startDate,
        arguments.maxNo,
        arguments.isPublic,
      ],
      account,
      feeCurrency: getFeeCurrency(),
      // nonce: nonceToUse,
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.error("Contract error:", {
      message: error.message,
      details: error.details,
      nonce: error.nonce,
    });
    return null;
  }
};

//function to join private chama
const joinPrivateChama = async (privateKey, arguments) => {
  const account = privateKeyToAccount(privateKey);
  try {
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "addMember",
      args: [arguments.address, arguments.chamaId],
      account,
      feeCurrency: getFeeCurrency(),
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to join a public chama
const joinPublicChama = async (privateKey, blockchainId) => {
  const account = privateKeyToAccount(privateKey);
  console.log("joing chama on bc..");
  console.log(blockchainId);
  let nonceToUse;
  try {
    const latestNonce = await getLatestNonce(account.address);
    console.log(`latest nonce: ${latestNonce}`);
    if (!latestNonce) {
      return null;
    }
    nonceToUse = latestNonce + 1;
    console.log(`nonce to use: ${nonceToUse}`);
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "addPublicMember",
      args: [blockchainId],
      account,
      feeCurrency: getFeeCurrency(),
      nonce: nonceToUse,
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to record the deposit of a member
const recordDeposit = async (privateKey, arguments) => {
  const account = privateKeyToAccount(privateKey);
  const amount = parseEther(arguments.amount);
  let nonceToUse;
  try {
    const latestNonce = await getLatestNonce(account.address);
    console.log(`latest nonce: ${latestNonce}`);
    if (!latestNonce) {
      return null;
    }
    nonceToUse = latestNonce + 1;
    console.log(`nonce to use: ${nonceToUse}`);
    console.log("Simulating contract...");
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "depositCash",
      args: [arguments.blockchainId, amount],
      account,
      feeCurrency: getFeeCurrency(),
      nonce: nonceToUse,
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.log(`Recording to blockchain: ${error}`);
    return null;
  }
};

//function to check pay date
const executePayDate = async (chamaIds) => {
  // this function is done by ai agent so we will use the ai agent's private key
  const account = privateKeyToAccount(aiAgentPrivateKey);
  console.log(account);
  if (!account) {
    console.log("privatekey not found");
  }
  try {
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "checkPayDate",
      args: [chamaIds],
      account,
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to set the payout order
const setPayOutOrder = async (chamaId, addresses) => {
  // this function is done by ai agent so we will use the ai agent's private key
  const account = privateKeyToAccount(aiAgentPrivateKey);
  if (!account) {
    console.log("privatekey not found");
  }
  try {
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "setPayoutOrder",
      args: [BigInt(chamaId), addresses],
      account,
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to send cKES
const sendCKES = async (privateKey, amount) => {
  try {
    const account = privateKeyToAccount(privateKey);

    // 1. Check balances
    const [celoBalance, ckesBalance] = await Promise.all([
      publicClient.getBalance({ address: account.address }),
      contract.read.balanceOf([account.address]),
    ]);
    console.log(`Balances:
      CELO: ${formatEther(celoBalance)} 
      cKES: ${formatEther(ckesBalance)}`);
    if (ckesBalance >= Number(amount)) {
      console.log("sending...");
      const { request } = await publicClient.simulateContract({
        address: cKESContractAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [chamapayContractAddress, parseEther(amount)],
        account,
        feeCurrency: getFeeCurrency(),
      });
      const hash = await walletClient.writeContract(request);
      console.log(hash);
      return hash;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// function to export user's cUSD balance
const getCKESBalance = async (userAddress) => {
  try {
    const balance = await contract.read.balanceOf([userAddress]);
    return formatEther(balance);
  } catch (error) {
    console.log(`getting bal error: ${error}`);
    return null;
  }
};

// creates a new walllet for a new user
const getWallets = () => {
  const randomWallet = ethers.Wallet.createRandom();
  return randomWallet;
};

module.exports = {
  registerChama,
  joinPrivateChama,
  joinPublicChama,
  recordDeposit,
  executePayDate,
  setPayOutOrder,
  getLatestNonce,
  getWallets,
  sendCKES,
  getCKESBalance,
};
