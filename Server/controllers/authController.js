// This file has authentication related functions i.e signup and login
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { getWallets } = require("../utils/walletUtils");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { email, password, userName } = req.body;
  const formattedEmail = email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: formattedEmail },
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const wallet = await getWallets();
  if (wallet) {
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: userName,
        password: hashedPassword,
        address: wallet.address,
        privKey: wallet.signingKey.privateKey,
        mnemonics: wallet.mnemonic.phrase,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } else {
    console.log("unable to.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const formatEmail = email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({
      where: { email: formatEmail },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
