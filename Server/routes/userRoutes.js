// This file has routes for user operations
const express = require("express");
const router = express.Router();
const {
  getUser,
  getUserPayments,
  getUserNotifications,
} = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");

// get functions
router.get("/", authenticate, getUser);
router.get("/payments", authenticate, getUserPayments);
router.get("/notifications", authenticate, getUserNotifications);

module.exports = router;
