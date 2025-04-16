// This file has all helper functions
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//function to convert selected date to timestamp
const convertDateToTimestamp = (str) => {
  const [day, month, yearTime] = str.split("/");
  const [year, time] = yearTime.split(" ");
  const formattedStr = `${year}-${month}-${day}T${time}`;
  const timestamp = new Date(formattedStr).getTime();
  return timestamp;
};

// function to change date string to required js date
const changeDateToRequire = (originalStr) => {
  const [day, month, yearTime] = originalStr.split("/");
  const [year, time] = yearTime.split(" ");
  const formatted = `${year}-${month}-${day}T${time}`;
  return new Date(formatted);
};

//prisma function to record user payment and locked amount
const recordPaymentAndLocked = async (
  amount,
  userId,
  description,
  chamaId,
  txHash
) => {
  if (!amount || !userId || !chamaId || !txHash) {
    throw new Error("Missing required parameters");
  }
  const allArgs = { amount, userId, chamaId, txHash };
  await prisma.payment.create({
    data: {
      amount: BigInt(amount * 10 ** 18),
      txHash: txHash,
      description: description,
      userId: userId,
      chamaId: Number(chamaId),
    },
  });
};

// function to get user addresses from user Ids array
const getUsersAddresses = async (userIds) => {
  // Input validation
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds must be a non-empty array");
  }

  //  Database query
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        address: true,
      },
    });

    // Verifing we found all requested users
    if (users.length !== userIds.length) {
      const foundIds = users.map((u) => u.id);
      const missingIds = userIds.filter((id) => !foundIds.includes(id));
      console.warn(`Missing users for IDs: ${missingIds.join(", ")}`);
    }

    return users.map((user) => user.address);
  } catch (error) {
    console.error("Failed to fetch user addresses:", error);
    throw new Error("Database operation failed");
  }
};

//prisma function to get all the chamas that have not started
const getAllUnstartedChamas = async () => {
  return await prisma.chama.findMany({
    where: {
      started: false,
      startDate: {
        lte: new Date(), //  chamas where startDate has passed
      },
    },
    include: {
      members: {
        select: {
          user: true,
        },
      },
    },
    orderBy: {
      startDate: "asc", // Get oldest first
    },
  });
};

// getting the userId of a user who received a payout
// done by using the chama cycle to get index of the user to receive payout
const getUserToReceivePayout = async (chamaId, cycle) => {
  try {
    const chama = await prisma.chama.findUnique({
      where: { id: chamaId },
      select: {
        payOutOrder: true,
        members: {
          // Include members to validate
          select: { userId: true },
        },
      },
    });

    if (!chama) {
      throw new Error("Chama not found");
    }

    if (!chama.payOutOrder) {
      throw new Error("Payout order not established for this chama");
    }

    const payoutOrder = JSON.parse(chama.payOutOrder);

    // Validate cycle is within bounds
    if (cycle >= payoutOrder.length) {
      throw new Error("Cycle number exceeds payout order length");
    }

    const userId = payoutOrder[cycle];

    // Verify user is still a member
    const isStillMember = chama.members.some((m) => m.userId === userId);
    if (!isStillMember) {
      throw new Error("User at this cycle position is no longer a member");
    }

    return userId;
  } catch (error) {
    console.error("Error getting payout recipient:", error);
    throw error; // Re-throw for handling by caller
  }
};

// function to get user's cKES functions
const getCKESTransactions = async (userAddress) => {
  try {
    const response = await fetch(
       `https://explorer.celo.org/mainnet/api?module=account&action=tokentx&address=${userAddress}&contractaddress=0x456a3D042C0DbD3db53D5489e98dFb038553B0d0` // cKES contract
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  convertDateToTimestamp,
  getUsersAddresses,
  changeDateToRequire,
  recordPaymentAndLocked,
  getAllUnstartedChamas,
  getCKESTransactions,
  getUserToReceivePayout,
};
