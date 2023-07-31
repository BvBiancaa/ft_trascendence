/*
  Warnings:

  - Added the required column `twoFaActive` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFaActive" BOOLEAN NOT NULL,
ADD COLUMN     "twoFaSecret" TEXT;
