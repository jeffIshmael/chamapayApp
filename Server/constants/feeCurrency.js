const {
  cKESContractAddress,
  cUSDContractAddress,
} = require("./contractAddress");

const getFeeCurrency = () => {
  const feeCurrency = process.env.GAS_FEE_CURRENCY.toLowerCase();
  if (feeCurrency === "ckes") return cKESContractAddress;
  if (feeCurrency === "cusd") return cUSDContractAddress;
  return "";
};

module.exports = { getFeeCurrency };
