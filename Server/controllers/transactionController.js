const { getUserPrivateKey } = require("./userController");
const { getGasFee } = require("../utils/transactions");

// gets the transaction fee
exports.getTransactionFee = async (req, res) => {
  const { amount } = req.query;
  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }
  const userId = req.user.userId;
  const privateKey = await getUserPrivateKey(userId);
  if (privateKey === null) {
    return res.status(400).json({ error: "No privateKey!" });
  }
  try {
    const fee = await getGasFee(amount, privateKey);
    if (!fee) {
      return res.status(400).json({ error: "Failed to get transaction fee" });
    }
    res.status(200).json(fee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get transaction fee" });
  }
};


