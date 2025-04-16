// this file contains all the cron jobs

const {
  getAllUnstartedChamas,
  getUserToReceivePayout,
  getUsersAddresses,
} = require("./helperFunctions");
const { setPayOutOrder, executePayDate } = require("./walletUtils");
const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// cron job to check if a chamas startdate has reached
// function to set started if a chama startdate has reached
const checkStartDate = async () => {
  try {
    let newStartedChamas = [];
    const chamas = await getAllUnstartedChamas();
    for (const chama of chamas) {
      // update started to true
      if (chama.startDate <= Date.now()) {
        const updatedChama = await prisma.chama.update({
          where: {
            id: chama.id,
          },
          data: {
            started: true,
          },
        });
        newStartedChamas.push(updatedChama);
      }
      // update the payout order
      for (const chama of newStartedChamas) {
        if (!chama.members || !Array.isArray(chama.members)) {
          console.log(`Chama with ID ${chama.id} has no members loaded.`);
          continue;
        }

        const shuffledMemberIds = chama.members
          .map((m) => m.userId)
          .sort(() => Math.random() - 0.5);

        // get addresses of the shufflesMembersIds
        const shuffledMembersAddresses = await getUsersAddresses(
          shuffledMemberIds
        );

        // update payout order to the blockchain - need an array of the addresses
        const hash = await setPayOutOrder(
          chama.blockchainId,
          shuffledMembersAddresses
        );

        if (!hash) {
          console.log("Unable to set payout to the blockchain.");
          return;
        }

        await prisma.chama.update({
          where: { id: chama.id },
          data: {
            payoutOrder: JSON.stringify(shuffledMemberIds), // Store as JSON
          },
        });

        // Update member positions
        await Promise.all(
          chama.members.map((member) => {
            const position = shuffledMemberIds.indexOf(member.userId) + 1;
            return prisma.chamaMember.update({
              where: { id: member.id },
              data: { payoutPosition: position },
            });
          })
        );

        // send notification to the user
        await Promise.all(
          chama.members.map((member, index) => {
            const position = shuffledMemberIds.indexOf(member.userId) + 1;
            return prisma.notification.create({
              data: {
                message: `Your payout position in ${chama.name} is #${position}`,
                userId: member.userId,
                chamaId: chama.id,
              },
            });
          })
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// function to check pay date of a chama and trigger process payout on the blockchain
const checkPayDate = async () => {
  try {
    let chamasBlockchainIds = [];
    let chamasToBePaid = [];
    // get all started chamas
    const chamas = await prisma.chama.findMany({
      where: {
        started: true,
      },
    });
    for (const chama of chamas) {
      // check if pay date has been reached
      if (chama.payDate <= Date.now()) {
        // push the blockchainChamaId to the array
        chamasBlockchainIds.push(chama.blockchainId);
        chamasToBePaid.push(chama);
      }
    }
    if (
      !Array.isArray(chamasBlockchainIds) ||
      chamasBlockchainIds.length === 0
    ) {
      return;
    }
    console.log(`block chain Ids: ${chamasBlockchainIds}`);
    // call the process payout function( blockchain function) requires array of blockchainIds
    const hash = await executePayDate(chamasBlockchainIds);
    if (!hash) {
      console.log("Unable to process payout to the blockchain.");
      return;
    }

    for (chama of chamasToBePaid) {
      // get the userId
      const userId = await getUserToReceivePayout(chama.id, chama.cycle);
      // update payout
      await prisma.payOut.create({
        data: {
          amount: chama.amount,
          chamaId: chama.id,
          userId: userId,
        },
      });
      // send  notification to the users
      await Promise.all(
        chama.members.map((member, index) => {
          return prisma.notification.create({
            data: {
              message: `${chama.cyle + 1} payout for ${
                chama.name
              } has been processed`,
              userId: member.userId,
              chamaId: chama.id,
            },
          });
        })
      );

      // update the chama
      await prisma.chama.update({
        where: { id: chama.id },
        data: {
          cycle: chama.cycle + 1,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const initializeCronJobs = async () => {
  try {
    // immediate execution
    console.log("Running initial checks...");
    await checkStartDate();
    await checkPayDate();
    console.log("Initial checks completed");

    // set up scheduled jobs
    cron.schedule("*/30 * * * *", async () => {
      console.log("[Cron] Running checkStartDate...", new Date().toISOString());
      try {
        await checkStartDate();
      } catch (error) {
        console.error("Error in checkStartDate:", error);
      }
    });

    cron.schedule("0 * * * *", async () => {
      console.log("[Cron] Running checkPayDate...", new Date().toISOString());
      try {
        await checkPayDate();
      } catch (error) {
        console.error("Error in checkPayDate:", error);
      }
    });

    console.log("Cron jobs scheduled");
  } catch (initialError) {
    console.log("Initial execution failed:", initialError);
    setTimeout(initializeCronJobs, 60000); // Retry after 1 minute
  }
};

module.exports = {
  initializeCronJobs,
};
