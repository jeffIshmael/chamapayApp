const { ethers } = require("hardhat");

async function main() {

  // Deploying contract with constructor arguments
  const chamaPay = await ethers.deployContract("ChamaPay");

  await chamaPay.waitForDeployment();

  console.log("ChamaPay contract address - " + (await chamaPay.getAddress()));
}

// Error handling
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
