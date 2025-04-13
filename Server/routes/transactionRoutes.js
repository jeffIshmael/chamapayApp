// routes that are used to get tx fees for transfer fxns
const express = require("express");
const router = express.Router();
const { getTransactionFee } = require("../controllers/transactionController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, getTransactionFee);

module.exports = router;