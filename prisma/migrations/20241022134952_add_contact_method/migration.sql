-- CreateTable
CREATE TABLE `ContactMethod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `platform` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `profile_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContactMethod` ADD CONSTRAINT `ContactMethod_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
