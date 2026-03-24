-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalysisResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentId` INTEGER NOT NULL,
    `summary` VARCHAR(191) NOT NULL,
    `keyPoints` JSON NOT NULL,
    `difficulties` JSON NOT NULL,
    `suggestions` JSON NOT NULL,
    `tags` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AnalysisResult_documentId_key`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flashcard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentId` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `tags` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Summary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `keyPoints` JSON NOT NULL,
    `suggestions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnalysisResult` ADD CONSTRAINT `AnalysisResult_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flashcard` ADD CONSTRAINT `Flashcard_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summary` ADD CONSTRAINT `Summary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
