/*
  Warnings:

  - You are about to drop the column `platform` on the `contactmethod` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `contactmethod` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `contactmethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ContactMethod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ContactMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `contactmethod` DROP FOREIGN KEY `ContactMethod_profile_id_fkey`;

-- AlterTable
ALTER TABLE `contactmethod` DROP COLUMN `platform`,
    DROP COLUMN `profile_id`,
    DROP COLUMN `username`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `_ProfileContactMethods` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProfileContactMethods_AB_unique`(`A`, `B`),
    INDEX `_ProfileContactMethods_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ContactMethod_name_key` ON `ContactMethod`(`name`);

-- AddForeignKey
ALTER TABLE `_ProfileContactMethods` ADD CONSTRAINT `_ProfileContactMethods_A_fkey` FOREIGN KEY (`A`) REFERENCES `ContactMethod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProfileContactMethods` ADD CONSTRAINT `_ProfileContactMethods_B_fkey` FOREIGN KEY (`B`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
