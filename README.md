# CHAMAPAY

<p align="center">
  <img src="./logo.png" alt="Chamapay Logo" width="120" style="border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <h1 align="center">Revolutionizing Community Savings with Blockchain</h1>
</p>

<p align="center">
  <strong>Digital Chamas · Transparent · Secure · Borderless</strong>
</p>

<p align="center">
  <a href="#introduction">Introduction</a> ·
  <a href="#implemented-features">Features</a> ·
  <a href="#how-chamapay-works">How It Works</a> ·
  <a href="#getting-started">Get Started</a> .
  <a href="#demo">Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-MobileApp-brightgreen" alt="Platform">
  <img src="https://img.shields.io/badge/Blockchain-Celo-yellow" alt="Blockchain">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
</p>

## Introduction

Chamapay is a mobile application that digitizes circular savings groups (commonly known as "chamas" in East Africa). It leverages blockchain technology to provide a secure, transparent, and accessible platform for group savings and financial collaboration.

### What are Circular Savings?

Circular savings (or "chamas") are community-based savings groups where members contribute fixed amounts at regular intervals. Funds are then distributed rotationally to each participant, combining savings and peer lending.

## Problem Statement

Traditional circular savings groups face several limitations:

1. **Geographical Barriers** – Limited to physical communities due to trust requirements (e.g., workplace or neighborhood groups).
2. **Lack of Variety** – Few options for joining different types of savings groups.
3. **Manual Management** – Requires extensive record-keeping (contributions, payouts, penalties) which is prone to errors.

## Solution

Chamapay solves these problems by offering a **digital circular savings platform** powered by the **Celo blockchain**. Key benefits include:

- **Smart Contract Automation** – Contributions and payouts are enforced programmatically.
- **Transparency** – All transactions are recorded on-chain.
- **Financial Inclusion** – Low-cost mobile transactions with cKES (a Kenyan Shilling-pegged stablecoin).

---

## Technologies Used

| Category            | Technology Stack                |
| ------------------- | ------------------------------- |
| **Mobile App**      | React Native (Expo)             |
| **Backend**         | Node.js                         |
| **Blockchain**      | Celo Network                    |
| **Smart Contracts** | Solidity + Viem for integration |
| **Database**        | PostgreSQL (Prisma ORM)         |
| **Stablecoin**      | cKES                            |

---

## How Chamapay Works

### Key Features

✅ **Smart Contract Automation**

- Funds held in escrow and released automatically.
- Enhanced security to cater for defaults.

✅ **Transparency**

- All transactions recorded on-chain for auditability.

✅ **Financial Inclusion**

- Supports unbanked users via Celo’s mobile-first blockchain.
- Uses **cKES** to avoid cryptocurrency volatility.

✅ **Flexible Chama Types**

| Feature                | Public Chama                        | Private Chama                  |
| ---------------------- | ----------------------------------- | ------------------------------ |
| **Access**             | Open to all users                   | Invite-only (family & friends) |
| **Default Protection** | Requires locked funds as collateral | Trust-based (no collateral)    |
| **Max Members**        | Limited (configurable)              | No strict limit                |
| **Security**           | Locking system                      | Lower (relies on trust)        |

---

## Workflow

1. **Sign Up**

   - Users register with email, username, and password.
   - A wallet address and recovery phrase are generated.

2. **Create or Join a Chama**

   - Users can create **public** or **private** chamas.
   - Public chamas require locking funds as collateral.

3. **Deposit Funds**

   - Contributions can be made via **M-Pesa** or crypto transfer.

4. **Automated Payouts**
   - Smart contracts handle payouts based on the schedule.

---

## Security Measures

🔒 **Public Chamas**

- Members must lock funds to cover potential defaults.
- If a user misses a payment, locked funds are used automatically.

⚠️ **Private Chamas**

- Designed for trusted groups (no collateral required).
- Admins approve members to join.

---

## Implemented Features

- ✅ Smart contract deployment (Celo) [View smart contract](https://celoscan.io/address/0x0E7ae45bB8CC7f649fDeaefa54E5356a6C25c3B7)
- ✅ Chama creation (public/private)
- ✅ Join public chamas
- ✅ Deposit funds (cKES via M-Pesa or wallet)
- ✅ Automated payouts
- ✅ Account abstraction (pay gas in cKES)

## Upcoming Features

🛠 **Paymaster Integration**

- Sponsor gas fees for users.

🛠 **Dynamic Membership**

- Handle mid-cycle member exits/additions.

🛠 **Hosting & Deployment**

- Launch production-ready app.

---

## Demo

📹 Watch our demo video: [YouTube Link](https://youtu.be/JiQXT1SIHPI)

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- Expo Go (mobile) / Android Studio (emulator)
- ngrok (for local testing)

### Steps

1.  Clone the repo:

    ```bash

    git clone https://github.com/jeffIshmael/chamapayApp.git
    cd chamapayApp/Application
    npm install
    ```

2.  Start the app.

    ```bash
    npx expo start

    ```

    (Then press S to switch it to expo go.)

3.  On another terminal, start the backend.

    ```bash
        cd ../Server
        npm install
        npm start

    ```

4.  In the server folder, change the .env.example to .env and fill in the variables as instructed.
5.  Expose the server with ngrok:(in another terminal.)

    ```bash
        ngrok http http://localhost:3000
    ```

6.  Update endpoint.ts with the ngrok URL.(in chamapayApp/Application/constants).
7.  Scan the QR code in Expo Go to launch the app.

---

## Contact

For any questions or feedback, feel free to reach out to us:

Email: [chamapay37@gmail.com](chamapay37@gmail.com).
