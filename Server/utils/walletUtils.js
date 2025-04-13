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
const { celoAlfajores } = require("viem/chains");

const chamapayContractAddress = "0xaaC8431C5401aF70cD802492A3e133667873c4Da";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: celoAlfajores,
  transport: http(),
});

const contract = getContract({
  address: cUSDContractAddress,
  abi: erc20Abi,
  client: publicClient,
  feeCurrency: cUSDContractAddress,
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
      nonce: nonceToUse,
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
  console.log(arguments);
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
const checkPayDate = async (privateKey, arguments) => {
  const account = privateKeyToAccount(privateKey);
  try {
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "checkPayDate",
      args: [arguments],
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
const setPayOutOrder = async (privateKey, arguments) => {
  const account = privateKeyToAccount(privateKey);
  try {
    const { request } = await publicClient.simulateContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "setPayoutOrder",
      args: [arguments.chamaId, arguments.addresses],
      account,
    });
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to send cUSD
const sendCUSD = async (privateKey, amount) => {
  try {
    const account = privateKeyToAccount(privateKey);

    // 1. Check balances
    const [celoBalance, cusdBalance] = await Promise.all([
      publicClient.getBalance({ address: account.address }),
      contract.read.balanceOf([account.address]),
    ]);
    console.log(`Balances:
      CELO: ${formatEther(celoBalance)} 
      cUSD: ${formatEther(cusdBalance)}`);
    if (cusdBalance >= Number(amount)) {
      console.log("sending...");
      const { request } = await publicClient.simulateContract({
        address: cUSDContractAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [chamapayContractAddress, parseEther(amount)],
        account,
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
const getCUSDBalance = async (userAddress) => {
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
  console.log(randomWallet);
  return randomWallet;
};

module.exports = {
  registerChama,
  joinPrivateChama,
  joinPublicChama,
  recordDeposit,
  checkPayDate,
  setPayOutOrder,
  getLatestNonce,
  getWallets,
  sendCUSD,
  getCUSDBalance,
};
