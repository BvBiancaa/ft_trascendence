/*
  Warnings:

  - You are about to drop the column `elo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gamePlayed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "elo",
DROP COLUMN "gamePlayed",
DROP COLUMN "loses",
DROP COLUMN "wins";
