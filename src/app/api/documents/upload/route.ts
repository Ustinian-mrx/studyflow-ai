import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    sanitizeFilename,
    ensureUploadDir,
} from "@/lib/file";
import { processDocumentAnalysis } from "@/lib/services/document-analysis";

export async function POST(req: Request) {
    try {
        const mockUserId = 1;

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "请上传文件" }, { status: 400 });
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "仅支持 PDF、PNG、JPG、JPEG、WEBP 文件" },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "文件大小不能超过 10MB" },
                { status: 400 }
            );
        }

        const uploadDir = await ensureUploadDir();
        const safeFilename = sanitizeFilename(file.name);
        const savePath = path.join(uploadDir, safeFilename);

        const bytes = await file.arrayBuffer();
        await fs.writeFile(savePath, Buffer.from(bytes));

        const document = await prisma.document.create({
            data: {
                userId: mockUserId,
                filename: file.name,
                fileUrl: `/uploads/${safeFilename}`,
                fileType: file.type,
                status: "uploading",
            },
        });

        void processDocumentAnalysis(document.id);

        return NextResponse.json({
            id: document.id,
            filename: document.filename,
            fileUrl: document.fileUrl,
            status: document.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "上传失败",
            },
            { status: 500 }
        );
    }
}