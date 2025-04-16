//This file contains all blockchain read functions

const {
  createPublicClient,
  http,
} = require("viem");
const { celo } = require("viem/chains");

const chamaPayAbi = require("../abis/chamapay.json");
const { getUserAddress } = require("../controllers/userController");
const {chamapayContractAddress} = require("../constants/contractAddress");

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

//function to get the total chamas created
const getTotalChamas = async () => {
  try {
    const data = await publicClient.readContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "totalChamas",
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to get the balance of a user
const getChamaBalance = async (BlockchainId, userId) => {
  try {
    // get user address from userId
    const userAddress = await getUserAddress(userId);
    const data = await publicClient.readContract({
      address: chamapayContractAddress,
      abi: chamaPayAbi,
      functionName: "getBalance",
      args: [BigInt(BlockchainId), userAddress],
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { getTotalChamas, getChamaBalance };
