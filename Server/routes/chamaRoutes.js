// this file defines the routes that have to do with the chama
const express = require("express");
const router = express.Router();
const {
  registerChama,
  joinChama,
  joinPublicChama,
  getAllChamas,
  getMyChamas,
  getChamaById,
  createMessage,
  getChamaMessages,
  getChamaDeposit,
  updateChamaDeposit,
  sendToChama,
} = require("../controllers/chamaController");
const authenticate = require("../middlewares/authMiddleware");

// post function
router.post("/public", authenticate, registerChama);
router.post("/join", authenticate, joinChama);
router.post("/add", authenticate, joinPublicChama);
router.post("/send", authenticate, sendToChama);
router.post("/:chamaId", authenticate, createMessage);
router.post("/deposit/:chamaId", authenticate, updateChamaDeposit);


// get functions
router.get("/chamas", authenticate, getAllChamas);
router.get("/myChamas", authenticate, getMyChamas);
router.get("/:chamaId", authenticate, getChamaById);
router.get("/messages/:chamaId", authenticate, getChamaMessages);
router.get("/deposits/:chamaId", authenticate, getChamaDeposit);

module.exports = router;
