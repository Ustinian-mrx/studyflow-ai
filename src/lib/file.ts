import path from "path";
import fs from "fs/promises";

export const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB 上限

export function sanitizeFilename(filename: string) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);

    // 仅保留中文、字母、数字和基础符号，避免路径中的危险字符。
    const safeBase = base.replace(/[^\u4e00-\u9fa5a-zA-Z0-9-_]/g, "_");
    return `${Date.now()}_${safeBase}${ext}`;
}

export async function ensureUploadDir() {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    return uploadDir;
}
