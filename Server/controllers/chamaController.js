// this file has all chama relates functions
const { PrismaClient } = require("@prisma/client");
const { parseEther } = require("viem");
const { getUserPrivateKey } = require("./userController");
const {
  joinPrivateChama,
  registerChama,
  sendCKES,
  joinPublicChama,
  recordDeposit,
} = require("../utils/walletUtils");
const { getTotalChamas, getChamaBalance } = require("../utils/readFunctions");
const {
  convertDateToTimestamp,
  recordPaymentAndLocked,
  changeDateToRequire,
} = require("../utils/helperFunctions");
const prisma = new PrismaClient();

// function to register chama
exports.registerChama = async (req, res) => {
  const { name, amount, maxNo, days, startDate, isPublic, txHash } = req.body;
  const unique = name.replace(/\s+/g, "-").toLowerCase();

  const exist = await prisma.chama.findUnique({ where: { slug: unique } });
  if (exist) {
    return res.status(400).json({ error: "The chama exists." });
  }
  const privateKey = await getUserPrivateKey(req.user.userId);
  if (privateKey === null) {
    return res.status(400).json({ error: "No privateKey!" });
  }
  let createdChama;
  let blockchainId;
  try {
    //convert selected date
    const timestamp = await convertDateToTimestamp(startDate);

    const prismaStartDate = await changeDateToRequire(startDate);

    // Add days to get payDate
    const payDate = new Date(prismaStartDate);
    payDate.setDate(payDate.getDate() + days);

    const createdChamaBlockchainId = await getTotalChamas();
    //the blockchain id of the created chama
    blockchainId = Number(createdChamaBlockchainId);

    // writing to blockchain
    const tx = await registerChama(privateKey, {
      amount: BigInt(amount * 10 ** 18),
      duration: BigInt(days),
      startDate: BigInt(timestamp), // Convert to Unix timestamp
      maxNo: BigInt(maxNo),
      isPublic: isPublic,
    });
    console.log(`chama creation hash: ${tx}`);

    if (!tx) {
      return res
        .status(500)
        .json({ error: "Failed to register chama on blockchain" });
    }

    // Create the chama record in your database
    await prisma.$transaction(async (prisma) => {
      const chama = await prisma.chama.create({
        data: {
          name: name,
          type: isPublic ? "Public" : "Private",
          amount: BigInt(amount * 10 ** 18),
          cycleTime: Number(days),
          maxNo: Number(maxNo),
          slug: unique,
          startDate: prismaStartDate,
          payDate: payDate,
          blockchainId: blockchainId,
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
    if (isPublic) {
      // function to record payment and locked amount
      await recordPaymentAndLocked(
        amount,
        req.user.userId,
        "You locked",
        createdChama.id,
        txHash
      );
    }
    // Convert BigInt to string before sending response
    const responseData = {
      createdChama: {
        ...createdChama,
        amount: createdChama.amount.toString(),
      },
      txHash,
    };
    res.status(201).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//add member to a private chama
exports.joinChama = async (req, res) => {
  const { chamaId } = req.body;
  const privateKey = await getUserPrivateKey(req.user.userId);
  if (privateKey === null) {
    return res.status(400).json({ error: "No privateKey!" });
  }
  try {
    const tx = await joinPrivateChama(privateKey, chamaId);
    if (!tx) {
      return res
        .status(500)
        .json({ error: "Failed to join chama! Check gas fees." });
    }
    await prisma.chamaMember.create({
      data: {
        user: { connect: { id: req.user.userId } },
        chama: { connect: { id: chamaId } },
        payDate: new Date(),
      },
    });
    res.status(201).json({ message: "Member added successfully" }, tx);
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
};

//add member to a public chama
exports.joinPublicChama = async (req, res) => {
  const { chamaId, userId, blockchainId, txHash, amount } = req.body;
  try {
    // adding member to the blockchain
    const tx = await joinPublicChama(BigInt(blockchainId));
    if (!tx) {
      res.status(500).json({ message: "Failed to write on the blockchain." });
    }
    await prisma.chamaMember.create({
      data: {
        user: { connect: { id: userId } },
        chama: { connect: { id: chamaId } },
        payDate: new Date(),
      },
    });
    // record the payment and locked amount
    await recordPaymentAndLocked(amount, userId, "You locked", chamaId, txHash);
    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
};

//get all chamas
exports.getAllChamas = async (req, res) => {
  try {
    // Find chamas where user is NOT a member
    const nonMemberChamas = await prisma.chama.findMany({
      where: {
        type: "Public", // Only public chamas
        members: {
          none: {
            userId: req.user.userId, // User is not in members list
          },
        },
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                address: true,
              },
            },
          },
        },
        payOutOrder: false,
        payOuts: false,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    // Handle BigInt conversion for all chamas and their amounts
    const formattedChamas = nonMemberChamas.map((chama) => ({
      ...chama,
      amount: chama.amount.toString(), // Convert BigInt to string
    }));

    res.status(200).json({
      chamas: formattedChamas,
    });
  } catch (error) {
    console.log("Error fetching non-member chamas:", error);
    res.status(500).json({
      error: "Failed to fetch chamas",
      details: error.message,
    });
  }
};

//get my chamas
exports.getMyChamas = async (req, res) => {
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

      //handling big int for chama
      const handledChama = {
        ...chama,
        amount: chama.amount.toString(),
      };

      if (handledChama) {
        chamas.push(handledChama);
      }
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, address: true, email: true },
    });
    res.status(200).json({ chamas, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chamas" });
  }
};

//get a chama by id
exports.getChamaById = async (req, res) => {
  const { chamaId } = req.params;
  const userId = req.user.userId;

  try {
    // fetch the basic chama information
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
                role: true,
              },
            },
          },
        },
        payOuts: {
          select: {
            amount: true,
            timestamp: true,
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

    if (!chama) {
      return res.status(404).json({ error: "Chama not found" });
    }

    // Check if the requesting user is a member
    const isMember = await prisma.chamaMember.findFirst({
      where: {
        chamaId: Number(chamaId),
        userId: Number(userId),
      },
    });
    const chamaBlockchainId = chama.blockchainId;
    // getting a user's balance from s.c
    const chamaBalance = await getChamaBalance(chamaBlockchainId, userId);

    // Prepare the response
    const response = {
      chama: {
        ...chama,
        amount: chama.amount.toString(),
        members: chama.members.map((m) => m.user), // Simplifys members structure
        payOuts: chama.payOuts
          ? chama.payOuts.map((p) => ({
              ...p,
              amount: p.amount.toString(), // Convert BigInt to string
              // Format date if needed
              timestamp: p.timestamp.toISOString(),
            }))
          : [], // Handle case where payOuts is null/undefined
        payoutOrder: chama.payoutOrder ? JSON.parse(chama.payoutOrder) : [], // Parse JSON string,
      },
      isMember: !!isMember,
      chamaBalance: chamaBalance.map((m) => m.toString()),
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Failed to fetch chama:", error);
    res.status(500).json({ error: "Failed to fetch chama details" });
  }
};

// create a message for a chama
exports.createMessage = async (req, res) => {
  const { chamaId } = req.params;
  const { content } = req.body;
  try {
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
    res.status(201).json({ message, sender: user?.address });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// get a chama's messages
exports.getChamaMessages = async (req, res) => {
  const { chamaId } = req.params;
  const userId = req.user.userId;
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
    // checking if user is a member
    const isMember = await prisma.chamaMember.findFirst({
      where: {
        chamaId: Number(chamaId),
        userId: Number(userId),
      },
    });

    //preparing response
    const response = {
      chama: {
        ...chama,
        amount: chama.amount.toString(),
      },
      me: me,
      isMember: !!isMember,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chama" });
  }
};

//function to get users deposits for a chama
exports.getChamaDeposit = async (req, res) => {
  const { chamaId } = req.params;
  try {
    const deposits = await prisma.payment.findMany({
      where: {
        chamaId: Number(chamaId),
        userId: req.user.userId,
      },
      orderBy: {
        doneAt: "desc",
      },
    });

    // Convert each deposit's amount to string
    const formattedDeposits = deposits.map((deposit) => ({
      ...deposit,
      amount: deposit.amount.toString(), // Convert BigInt to string
    }));
    const response = {
      deposits: formattedDeposits,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch deposits" });
  }
};

//function to record a chama deposit
exports.updateChamaDeposit = async (req, res) => {
  const { chamaId } = req.params;
  const { amount, blockchainId } = req.body; //amount should be a string i.e "0.01"
  const userId = req.user.userId;
  const privateKey = await getUserPrivateKey(userId);
  if (privateKey === null) {
    return res.status(400).json({ error: "No privateKey!" });
  }
  let txHash;
  try {
    // Doing the blockchain fxns i.e snding cUSD& recording the deposit to the sc.
    // 1. First send cUSD
    const sendingTx = await sendCKES(privateKey, amount);

    // 2. Only if successful, record deposit
    const recordingReceipt = await recordDeposit(privateKey, {
      blockchainId: BigInt(blockchainId),
      amount: amount,
    });
    if (!recordingReceipt) {
      return res.status(400).json({ error: "Failed to record deposit." });
    }
    txHash = sendingTx;
    if (!txHash) {
      return res
        .status(400)
        .json({ error: "Failed to record deposit & send cUSD." });
    }
    const payment = await prisma.payment.create({
      data: {
        amount: parseEther(amount),
        txHash,
        description: "You deposited",
        userId: req.user.userId,
        chamaId: Number(chamaId),
      },
    });

    res.status(201).json({ txHash });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to record deposit" });
  }
};

//function to handle sending/locking cKES to a chama
exports.sendToChama = async (req, res) => {
  const { amount, chamaId, blockchainId, creation } = req.body;
  const userId = req.user.userId;
  const privateKey = await getUserPrivateKey(req.user.userId);
  if (privateKey === null) {
    return res.status(400).json({ error: "No privateKey!" });
  }
  try {
    const txHash = await sendCKES(privateKey, amount);
    if (!txHash) {
      return res
        .status(400)
        .json({ error: "Failed to send cKES! Ensure you have enough balance" });
    }
    if (!creation) {
      // adding member to the blockchain
      const tx = await joinPublicChama(
        privateKey,
        BigInt(Number(blockchainId))
      );
      if (!tx) {
        return res.status(400).json({ error: "Ensure you have enough gas." });
      }
      console.log("creating on prisma.");
      await prisma.chamaMember.create({
        data: {
          user: { connect: { id: userId } },
          chama: { connect: { id: chamaId } },
          payDate: new Date(),
        },
      });
      // record the payment and locked amount
      await recordPaymentAndLocked(
        Number(amount),
        userId,
        "You locked",
        chamaId,
        txHash
      );
    }
    console.log(`locked amout hash :${txHash}`);
    res.status(201).json(txHash);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to record deposit" });
  }
};

//function to geta chama payouts
exports.getChamaPayouts = async (req, res) => {
  const { chamaId } = req.params;
  try {
    const chama = await prisma.chama.findUnique({
      where: {
        id: chamaId,
      },
      include: {
        payOuts: true,
      },
    });
  } catch (error) {}
};
