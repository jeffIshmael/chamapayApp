// This file has all helper functions
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//function to convert selected date to timestamp
const convertDateToTimestamp = (startDate) => {
  const dateParts = startDate.split(/[/ :]/);
  const jsDate = new Date(
    parseInt(dateParts[2]), // year
    parseInt(dateParts[0]) - 1, // month (0-indexed)
    parseInt(dateParts[1]), // day
    parseInt(dateParts[3]), // hours
    parseInt(dateParts[4]) // minutes
  );
  return jsDate;
};

//prisma function to record user payment and locked amount
const recordPaymentAndLocked = async (amount, userId, chamaId, txHash) => {
  if (!amount || !userId || !chamaId || !txHash) {
    throw new Error("Missing required parameters");
  }
  const allArgs = { amount, userId, chamaId, txHash };
  await prisma.payment.create({
    data: {
      amount: BigInt(amount * 10 ** 18),
      txHash: txHash,
      userId: userId,
      chamaId: Number(chamaId),
    },
  });
  await prisma.lockedAmount.create({
    data: {
      amount: BigInt(amount * 10 ** 18),
      userId: userId,
      chamaId: Number(chamaId),
    },
  });
};

module.exports = { convertDateToTimestamp, recordPaymentAndLocked };
