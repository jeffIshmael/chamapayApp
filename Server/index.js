// server.js (Backend)

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const Web3 = require("web3");
const { newKitFromWeb3, CeloContract } = require("@celo/contractkit");
const BigNumber = require("bignumber.js");
const erc20 = require("./erc20.json");
const chamapay = require("./chamapay.json");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

dotenv.config();

const app = express();

const prisma = new PrismaClient(); // Instantiate Prisma Client
app.use(express.json());
app.use(cors()); // This allows all origins
app.use(express.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CKES = process.env.CKES;
const CUSD = process.env.CUSD;
const MINIPAY = process.env.MINIPAY;
const account1 = process.env.ACCOUNT_1;
const account2 = process.env.ACCOUNT_2;

const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = newKitFromWeb3(web3);

kit.defaultAccount = account1;

// add the account private key for tx signing when connecting to a remote node
kit.connection.addAccount(PRIVATE_KEY);

let cKESContract = new kit.connection.web3.eth.Contract(
  erc20,
  "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
);
// console.log(cKESContract);

let chamapayContract = new kit.connection.web3.eth.Contract(
  chamapay,
  "0x6c0e526F3976735fFad99F49813C275AA72c54E3"
);
//chamapay mainnet=0x2a6705a9bBa71f752643893b159072ae44D52Ed4

async function read() {
  let name = await chamapayContract.methods.totalChamas().call();
  console.log(name);
  const tx = await chamapayContract.methods
    .registerChama(11, 5, 1738728250, 6, true)
    .send({
      from: account1,
      feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    });
  console.log(tx);
}

async function interactWithCKES() {
  try {
    // Fetch the cKES contract
    // const cKESAddress = process.env.CKES;
    // const cKESContract = await kit.contracts.getContract(
    //   erc20,
    //   "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
    // );
    let contract = new kit.connection.web3.eth.Contract(
      erc20,
      "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
    );
    console.log(contract);
    // console.log(erc20);

    // console.log(cKESContract);
    const cUSDToken = await kit._web3Contracts.getStableToken();
    // console.log(cUSDToken);
    // Check balance
    const userAddress = account1;
    const balance = await contract.methods.balanceOf(userAddress).call();
    console.log(balance);

    await kit.setFeeCurrency(CKES);

    // Transfer example
    const recipientAddress = account2;
    console.log(recipientAddress);
    const amount = kit.web3.utils.toWei("0.00005", "ether"); // 5 cKES
    console.log(amount);
    const txo = await contract.methods.transfer(
      "0xA0A1869E5B987a87BCfbD0aF9C73327ABc0D13E1",
      5 * 10 * 18
    );
    const tx = await kit.sendTransactionObject(txo, {
      from: account1,
      maxFeePerGas: 10 ** 12,
    });
    const hash = await tx.getHash();
    const receipt = await tx.waitReceipt();
    console.log(receipt);
    console.log(hash);
    console.log("Transfer Successful:", receipt);
  } catch (error) {
    console.error("Error interacting with cKES:", error);
  }
}

function getWallets() {
  let randomWallet = ethers.Wallet.createRandom();
  console.log(randomWallet);
  return randomWallet;
}

// interactWithCKES();

//function to check accounts
// async function checkAccounts() {
//   const cUSDToken = await kit._web3Contracts.getStableToken();
//   console.log(cUSDToken);
//   const onecUSD = kit.web3.utils.toWei("0.000001", "ether");
//   console.log(onecUSD);
//   console.log(await kit.contracts.getContract());
// const gasPrice = await kit.connection.gasPrice(CKES);
// console.log(gasPrice);

// console.log(await kit.connection.estimateGas());
// await kit.setFeeCurrency(CKES);

// try {
// const gas = await kit.connection.estimateGas(txo);
// console.log(gas);
//   const txo = await cUSDToken.methods.transfer(MINIPAY, onecUSD);
//   const tx = await kit.sendTransactionObject(txo, { from: account1 , maxFeePerGas: 10**12 });
//   const hash = await tx.getHash();
//   const receipt = await tx.waitReceipt();
//   console.log(receipt);
//   console.log(hash);

// } catch (error) {
//   console.log(error);

// }

// let cUSDcontract = await kit.contracts.getStableToken();
// await kit.setFeeCurrency(CKES);
// console.log(await cUSDcontract.symbol());
// const balance = await kit.getTotalBalance(account1);
// console.log(balance);
// let cUSDtx = await cUSDcontract
//   .transfer(account2, 1*10**8)
//   .send({ feeCurrency: CKES });
// console.log(cUSDtx);
// }
// checkAccounts();

// Helper function to generate JWT
function generateToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
}

//middleware function to uthenticate
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization required" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user ID from the token
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Register Route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("done");

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const wallet = await getWallets();
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      address: wallet.address,
      privKey: wallet.publicKey,
      mnemonics: wallet.mnemonic.phrase,
    },
  });

  // Generate a token and return it
  const token = generateToken(user);
  res.status(201).json({ token });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
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
});

//register public chama route
app.post("/public", authenticate, async (req, res) => {
  console.log(req.body);
  const { name, amount, maxNo, days, startDate, isPublic } = req.body;
  const unique = name.replace(/\s+/g, "-").toLowerCase();
  console.log("heading there");
  const exist = await prisma.chama.findUnique({ where: { slug: unique } });
  if (exist) {
    return res.status(400).json({ error: "The chama exists." });
  }
  let txhash;
  let createdChama;
  const tx = await chamapayContract.methods
    .registerChama(Number(amount), Number(days), startDate, maxNo, isPublic)
    .send({ from: account1 });
  if (tx) {
    console.log(tx);
    txhash = tx.transactionHash;
    await prisma.$transaction(async (prisma) => {
      const chama = await prisma.chama.create({
        data: {
          name: name,
          type: isPublic ? "Public" : "Private",
          amount: Number(amount),
          cycleTime: Number(days),
          maxNo: Number(maxNo),
          slug: unique,
          startDate: new Date(startDate),
          payDate: new Date(
            new Date(startDate).getTime() + days * 24 * 60 * 60 * 1000
          ),
          admin: { connect: { id: req.user.userId } },
        },
      });

      await prisma.chamaMember.create({
        data: {
          user: { connect: { id: req.user.userId } },
          chama: { connect: { id: chama.id } },
          payDate: new Date(),
        },
      });
      createdChama = chama;
    });
    res.status(201).json({ createdChama, txhash });
  } else {
    res.status(500).json({ error: "Failed to create chama" });
  }
});

//add member to a private chama
app.post("/join", authenticate, async (req, res) => {
  const { chamaId } = req.body;
  try {
    await prisma.chamaMember.create({
      data: {
        user: { connect: { id: req.user.userId } },
        chama: { connect: { id: chamaId } },
        payDate: new Date(),
      },
    });
    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

//add member to a public chama
app.post("/add", authenticate, async (req, res) => {
  const { chamaId, userId } = req.body;
  try {
    await prisma.chamaMember.create({
      data: {
        user: { connect: { id: userId } },
        chama: { connect: { id: chamaId } },
        payDate: new Date(),
      },
    });
    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

//get all chamas
app.get("/chamas", async (req, res) => {
  try {
    const chamas = await prisma.chama.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    res.status(200).json(chamas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chamas" });
  }
});

//get my chamas
app.get("/mychamas", authenticate, async (req, res) => {
  try {
    const chamaIds = await prisma.chamaMember.findMany({
      where: {
        userId: req.user.userId,
      },
      select: {
        chamaId: true,
      },
    });
    const chamas = [];
    for (const chamaIdItem of chamaIds) {
      const chama = await prisma.chama.findUnique({
        where: {
          id: chamaIdItem.chamaId,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      if (chama) {
        chamas.push(chama);
      }
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, address: true, email: true },
    });
    console.log(chamas);
    res.status(200).json({ chamas, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chamas" });
  }
});

//get a chama
app.get("/chama/:chamaId", async (req, res) => {
  const { chamaId } = req.params;
  console.log(chamaId);
  try {
    const chama = await prisma.chama.findUnique({
      where: {
        id: Number(chamaId),
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });
    console.log(chama);
    res.send(chama);
    // res.status(200).json(chama);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chama" });
  }
});

//create a message
app.post("/chama/:chamaId", authenticate, async (req, res) => {
  const { chamaId } = req.params;
  const { content } = req.body;
  try {
    console.log(content);
    const message = await prisma.message.create({
      data: {
        text: content,
        chama: { connect: { id: Number(chamaId) } },
        sender: { connect: { id: req.user.userId } },
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, address: true },
    });
    console.log(user);
    res.status(201).json({ message, sender: user?.address });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

//get a chama messages
app.get("/chama/messages/:chamaId", authenticate, async (req, res) => {
  const { chamaId } = req.params;
  console.log(chamaId);
  try {
    const chama = await prisma.chama.findUnique({
      where: {
        id: Number(chamaId),
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });
    const me = req.user.userId;
    console.log(chama);
    res.status(200).json({ chama, me });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chama" });
  }
});

//function to get users deposits for a chama
app.get("/chama/deposits/:chamaId", authenticate, async (req, res) => {
  const { chamaId } = req.params;
  try {
    const deposits = await prisma.payment.findMany({
      where: {
        chamaId: Number(chamaId),
        userId: req.user.userId,
      },
    });
    res.status(200).json(deposits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deposits" });
  }
});

//function to record deposit
app.post("/chama/deposit/:chamaId", authenticate, async (req, res) => {
  const { chamaId } = req.params;
  const { amount, txHash } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        txHash,
        userId: req.user.userId,
        chamaId: Number(chamaId),
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      include: {
        name: true,
        address: true,
      },
    });
    res.status(201).json({ payment, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to record deposit" });
  }
});

//function to get user's all payments
app.get("/payments", authenticate, async (req, res) => {
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
});

//function to get user's notifications
app.get("/notifications", authenticate, async (req, res) => {
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
});

//update user's profile picture
app.post("/profile", authenticate, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Convert image buffer to Base64
    const encodedImage = req.file.buffer.toString("base64");

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${encodedImage}`,
      {
        folder: "profile_pictures",
        resource_type: "image",
      }
    );

    // Get Cloudinary image URL
    const imageUrl = uploadResponse.secure_url;

    // Update user's profile picture in database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { profile: imageUrl },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});

// API Route to fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Fetch users from SQLite
    res.status(200).json(users); // Return users as JSON
    console.log("done");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// API Route to create a new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newUser); // Return the created user
    console.log("done");
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

//function to  get a user
app.get("/user", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const balance = await cKESContract.methods.balanceOf("0x4821ced48Fb4456055c86E42587f61c1F39c6315").call();

    const userWithBalance = { ...user, balance };
    console.log(balance);
    console.log(user);
    res.json(userWithBalance);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//function to create a chama
app.post("/create", authenticate, async (req, res) => {
  const { name, amount, maxNo, days, startDate, type } = req.body;
  const unique = name.replace(/\s+/g, "-").toLowerCase();
  const exist = await prisma.chama.findUnique({ where: { slug: unique } });
  if (exist) {
    return res.status(400).json({ error: "The chama exists." });
  }

  try {
    // await kit.setFeeCurrency(CKES);
    const txo = await chamapayContract.methods.registerChama(
      BigInt(Number(amount)),
      BigInt(Number(days)),
      BigInt(Number(startDate))
    );
    // console.log(txo);
    const tx = await kit.sendTransactionObject(txo, {
      from: account1,
    });
    const hash = await tx.getHash();
    const receipt = await tx.waitReceipt();
    // console.log(receipt);
    console.log(hash);
    if (hash && receipt) {
      const chama = await prisma.chama.create({
        data: {
          name: name,
          type: type,
          amount: Number(amount),
          cycleTime: Number(days),
          maxNo: Number(maxNo),
          slug: name.replace(/\s+/g, "-").toLowerCase(),
          startDate: new Date(startDate),
          payDate: new Date(
            new Date(startDate).getTime() + days * 24 * 60 * 60 * 1000
          ),
          admin: { connect: { id: req.user.userId } },
        },
      });

      const allDetails = {
        chama: chama,
        hash: hash,
        receipt: receipt,
      };
      res.status(201).json(allDetails);
    } else {
      res.status(500).json({ error: "Prisma problem." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create chama" });
  }
});

//function to transfer cUSD and pay gas in cUSD
app.get("/pay", async (req, res) => {
  const { amount, address } = req.body;
  try {
    let cUSDcontract = await kit.contracts.getStableToken();
    let cUSDtx = await cUSDcontract
      .transfer(address, amount)
      .send({ feeCurrency: cUSDcontract.address });
    res.status(201).json(cUSDtx);
    console.log(cUSDtx);
  } catch (error) {
    res.status(500).json({ error: "Failed to transfer cUSD" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// getWallets();
