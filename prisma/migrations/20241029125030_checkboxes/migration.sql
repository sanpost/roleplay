/*
  Warnings:

  - You are about to drop the column `age_range` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `contact_methods` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `relationship` on the `profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `AgeRange_name_key` ON `agerange`;

-- DropIndex
DROP INDEX `ContactMethod_name_key` ON `contactmethod`;

-- DropIndex
DROP INDEX `Preference_name_key` ON `preference`;

-- DropIndex
DROP INDEX `Relationship_name_key` ON `relationship`;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `age_range`,
    DROP COLUMN `contact_methods`,
    DROP COLUMN `preferences`,
    DROP COLUMN `relationship`;

-- CreateTable
CREATE TABLE `UserPreference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `preference_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAgeRange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `age_range_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRelationship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `relationship_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserContactMethod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `contact_method_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_preference_id_fkey` FOREIGN KEY (`preference_id`) REFERENCES `Preference`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAgeRange` ADD CONSTRAINT `UserAgeRange_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAgeRange` ADD CONSTRAINT `UserAgeRange_age_range_id_fkey` FOREIGN KEY (`age_range_id`) REFERENCES `AgeRange`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRelationship` ADD CONSTRAINT `UserRelationship_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRelationship` ADD CONSTRAINT `UserRelationship_relationship_id_fkey` FOREIGN KEY (`relationship_id`) REFERENCES `Relationship`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserContactMethod` ADD CONSTRAINT `UserContactMethod_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserContactMethod` ADD CONSTRAINT `UserContactMethod_contact_method_id_fkey` FOREIGN KEY (`contact_method_id`) REFERENCES `ContactMethod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
