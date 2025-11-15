-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_role_userId_fkey`;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
