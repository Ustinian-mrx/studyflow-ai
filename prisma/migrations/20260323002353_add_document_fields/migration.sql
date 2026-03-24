/*
  Warnings:

  - You are about to alter the column `status` on the `document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `document` ADD COLUMN `errorMessage` TEXT NULL,
    ADD COLUMN `extractedText` LONGTEXT NULL,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    MODIFY `status` ENUM('uploading', 'extracting', 'analyzing', 'done', 'failed') NOT NULL DEFAULT 'uploading';
