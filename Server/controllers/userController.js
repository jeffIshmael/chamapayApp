// this file has all ser related functions
const { PrismaClient } = require("@prisma/client");

const { getCUSDBalance } = require("../utils/walletUtils");

const prisma = new PrismaClient();

// function to get a user
exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch the balance of the user
    const balance = await getCUSDBalance(user.address);
    const userWithBalance = { ...user, balance };
    res.status(200).json(userWithBalance);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//function to get user's all payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: req.user.userId,
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
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
