const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const chamaRoutes = require("./routes/chamaRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes); // All auth-related routes (e.g., /auth/register, /auth/login)
app.use("/chama", chamaRoutes); // All chama-related routes (e.g., /chama/public, /chama/join)
app.use("/user", userRoutes); //all user-related routes
app.use("/transaction", transactionRoutes);


module.exports = app;