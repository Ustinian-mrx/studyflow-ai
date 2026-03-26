-- AlterTable
ALTER TABLE `summary` ADD COLUMN `documentId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Summary_documentId_idx` ON `Summary`(`documentId`);

-- AddForeignKey
ALTER TABLE `Summary` ADD CONSTRAINT `Summary_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `summary` RENAME INDEX `Summary_userId_fkey` TO `Summary_userId_idx`;
