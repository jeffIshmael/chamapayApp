const { createPublicClient, http, createWalletClient } = require("viem");
const {  celoAlfajores } = require("viem/chains");

const PublicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: celoAlfajores,
  transport: http(),
});

module.exports = { PublicClient, walletClient };