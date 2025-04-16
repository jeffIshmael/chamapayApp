/*
  Warnings:

  - You are about to alter the column `amount` on the `Chama` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - Added the required column `blockchainId` to the `Chama` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mnemonics` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChamaMember" ADD COLUMN "payoutPosition" INTEGER;

-- CreateTable
CREATE TABLE "PayOut" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" BIGINT NOT NULL,
    "chamaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PayOut_chamaId_fkey" FOREIGN KEY ("chamaId") REFERENCES "Chama" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PayOut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chama" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "payDate" DATETIME NOT NULL,
    "cycleTime" INTEGER NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "amount" BIGINT NOT NULL,
    "blockchainId" INTEGER NOT NULL,
    "maxNo" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "payOutOrder" TEXT,
    "round" INTEGER NOT NULL DEFAULT 1,
    "cycles" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Chama_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chama" ("adminId", "amount", "createdAt", "cycleTime", "id", "maxNo", "name", "payDate", "slug", "startDate", "started", "type") SELECT "adminId", "amount", "createdAt", "cycleTime", "id", "maxNo", "name", "payDate", "slug", "startDate", "started", "type" FROM "Chama";
DROP TABLE "Chama";
ALTER TABLE "new_Chama" RENAME TO "Chama";
CREATE UNIQUE INDEX "Chama_slug_key" ON "Chama"("slug");
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" BIGINT NOT NULL,
    "doneAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txHash" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "chamaId" INTEGER NOT NULL,
    CONSTRAINT "Payment_chamaId_fkey" FOREIGN KEY ("chamaId") REFERENCES "Chama" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "chamaId", "doneAt", "id", "txHash", "userId") SELECT "amount", "chamaId", "doneAt", "id", "txHash", "userId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNo" INTEGER,
    "address" TEXT NOT NULL,
    "privKey" TEXT NOT NULL,
    "mnemonics" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT,
    "profile" TEXT
);
INSERT INTO "new_User" ("email", "id", "name", "password", "phoneNo", "role") SELECT "email", "id", "name", "password", "phoneNo", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
