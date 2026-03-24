import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const documentId = Number(id);

        if (Number.isNaN(documentId)) {
            return NextResponse.json({ error: "无效的文档 id" }, { status: 400 });
        }

        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                userId: user.id,
            },
            select: {
                id: true,
                filename: true,
                uploadedAt: true,
                status: true,
                errorMessage: true,
            },
        });

        if (!document) {
            return NextResponse.json(
                { error: "文档不存在或无权访问" },
                { status: 404 }
            );
        }

        const analysisResult = await prisma.analysisResult.findUnique({
            where: {
                documentId: document.id,
            },
            select: {
                summary: true,
                keyPoints: true,
                difficulties: true,
                suggestions: true,
                tags: true,
            },
        });

        return NextResponse.json({
            id: document.id,
            filename: document.filename,
            uploadedAt: document.uploadedAt.toISOString().slice(0, 16).replace("T", " "),
            status: document.status,
            summary: analysisResult?.summary ?? "",
            keyPoints: Array.isArray(analysisResult?.keyPoints)
                ? analysisResult.keyPoints.map(String)
                : [],
            difficulties: Array.isArray(analysisResult?.difficulties)
                ? analysisResult.difficulties.map(String)
                : [],
            suggestions: Array.isArray(analysisResult?.suggestions)
                ? analysisResult.suggestions.map(String)
                : [],
            tags: Array.isArray(analysisResult?.tags)
                ? analysisResult.tags.map(String)
                : [],
            errorMessage: document.errorMessage ?? "",
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: (error as Error).message || "获取分析结果失败",
            },
            { status: 500 }
        );
    }
}