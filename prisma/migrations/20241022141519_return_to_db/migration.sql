/*
  Warnings:

  - You are about to drop the `_profilecontactmethods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contactmethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_profilecontactmethods` DROP FOREIGN KEY `_ProfileContactMethods_A_fkey`;

-- DropForeignKey
ALTER TABLE `_profilecontactmethods` DROP FOREIGN KEY `_ProfileContactMethods_B_fkey`;

-- DropTable
DROP TABLE `_profilecontactmethods`;

-- DropTable
DROP TABLE `contactmethod`;
