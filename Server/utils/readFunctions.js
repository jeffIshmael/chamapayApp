//This file contains all blockchain read functions

const {
  createPublicClient,
  http,
} = require("viem");
const { celoAlfajores } = require("viem/chains");

const chamaPayAbi = require("../abis/chamapay.json");
const { getUserAddress } = require("../controllers/userController");

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

//function to get the total chamas created
const getTotalChamas = async () => {
  try {
    const data = await publicClient.readContract({
      address: "0xaaC8431C5401aF70cD802492A3e133667873c4Da",
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
      address: "0xaaC8431C5401aF70cD802492A3e133667873c4Da",
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
