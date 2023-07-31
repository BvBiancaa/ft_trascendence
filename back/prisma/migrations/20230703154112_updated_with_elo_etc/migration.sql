/*
  Warnings:

  - Added the required column `elo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamePlayed` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loses` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wins` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "elo" INTEGER NOT NULL,
ADD COLUMN     "gamePlayed" INTEGER NOT NULL,
ADD COLUMN     "loses" INTEGER NOT NULL,
ADD COLUMN     "nickName" TEXT NOT NULL,
ADD COLUMN     "wins" INTEGER NOT NULL;
