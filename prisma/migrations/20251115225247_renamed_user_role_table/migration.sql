/*
Warnings:

- You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

 */
-- DropForeignKey
ALTER TABLE `UserRole`
DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropTable
DROP TABLE `UserRole`;

-- CreateTable
CREATE TABLE
  `user_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` ENUM ('BOOK_USER', 'BOOK_ADMIN') NOT NULL,
    `userId` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;