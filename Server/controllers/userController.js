// this file has all ser related functions
const { PrismaClient } = require("@prisma/client");

const { getCKESBalance } = require("../utils/walletUtils");
const { getCKESTransactions } = require("../utils/helperFunctions");

const prisma = new PrismaClient();

// function to get a user
exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch the balance of the user
    const balance = await getCKESBalance(user.address);
    // fetch user's transactions
    const userTxs = await getCKESTransactions(user.address);
    if (userTxs == null) {
      return res.status(404).json({ message: "Can't get users transactions" });
    }
    const formattedResponse = { ...user, balance, userTxs };

    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//function to get user's all payments
// get a user's payments
exports.getUserPayments = async (req, res) => {
  const userId = req.user.userId;
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: Number(userId),
      },

      orderBy: {
        doneAt: "desc", // latest payments first
      },
    });

    // Format the BigInt values for client-friendly response
    const formatted = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount.toString(),
      doneAt: payment.doneAt.toISOString(),
      txHash: payment.txHash,
      description: payment.description,
      chama: payment.chama,
    }));

    res.status(200).json({ payments: formatted });
  } catch (error) {
    console.error("Failed to fetch user payments:", error);
    res.status(500).json({ error: "Failed to fetch user payments" });
  }
};

//function to get user's notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.userId,
      },
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

//function to get user's private key
exports.getUserPrivateKey = async (userId) => {
  try {
    const privateKey = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        privKey: true,
      },
    });
    return privateKey.privKey;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//function to get user's address
exports.getUserAddress = async (userId) => {
  try {
    const privateKey = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        address: true,
      },
    });
    return privateKey.address;
  } catch (error) {
    console.log(error);
    return null;
  }
};
