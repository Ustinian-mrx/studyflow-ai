-- AlterTable
ALTER TABLE `Summary`
    ADD COLUMN `periodEnd` DATETIME(3) NULL,
    ADD COLUMN `periodStart` DATETIME(3) NULL,
    MODIFY `period` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Summary_userId_type_createdAt_idx` ON `Summary`(`userId`, `type`, `createdAt`);

-- CreateIndex
CREATE INDEX `Summary_userId_periodStart_periodEnd_idx` ON `Summary`(`userId`, `periodStart`, `periodEnd`);
