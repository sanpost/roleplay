-- AlterTable
ALTER TABLE `profile` ADD COLUMN `contact_methods` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ContactMethod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ContactMethod_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
