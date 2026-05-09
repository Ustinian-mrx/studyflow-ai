/*
  Warnings:

  - You are about to alter the column `type` on the `summary` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[documentId,type]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `analysisresult` DROP FOREIGN KEY `AnalysisResult_documentId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_userId_fkey`;

-- DropForeignKey
ALTER TABLE `flashcard` DROP FOREIGN KEY `Flashcard_documentId_fkey`;

-- DropForeignKey
ALTER TABLE `summary` DROP FOREIGN KEY `Summary_userId_fkey`;

-- DropIndex
DROP INDEX `Document_userId_fkey` ON `document`;

-- DropIndex
DROP INDEX `Summary_userId_idx` ON `summary`;

-- AlterTable
ALTER TABLE `analysisresult` MODIFY `summary` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `flashcard` MODIFY `question` TEXT NOT NULL,
    MODIFY `answer` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `summary` MODIFY `type` ENUM('single', 'weekly') NOT NULL,
    MODIFY `content` LONGTEXT NOT NULL;

-- CreateIndex
CREATE INDEX `Document_userId_uploadedAt_idx` ON `Document`(`userId`, `uploadedAt`);

-- CreateIndex
CREATE INDEX `Document_userId_status_idx` ON `Document`(`userId`, `status`);

-- CreateIndex
CREATE INDEX `Summary_userId_createdAt_idx` ON `Summary`(`userId`, `createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `Summary_documentId_type_key` ON `Summary`(`documentId`, `type`);

-- CreateIndex
CREATE INDEX `User_createdAt_idx` ON `User`(`createdAt`);

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnalysisResult` ADD CONSTRAINT `AnalysisResult_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flashcard` ADD CONSTRAINT `Flashcard_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summary` ADD CONSTRAINT `Summary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `flashcard` RENAME INDEX `Flashcard_documentId_fkey` TO `Flashcard_documentId_idx`;
