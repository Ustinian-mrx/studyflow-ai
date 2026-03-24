import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const docId = Number(id);

        if (Number.isNaN(docId)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        const doc = await prisma.document.findUnique({
            where: { id: docId },
            include: { result: true },
        });

        if (!doc) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: doc.id,
            filename: doc.filename,
            uploadedAt: doc.uploadedAt.toISOString(),
            status: doc.status,
            summary: doc.result?.summary ?? "",
            keyPoints: Array.isArray(doc.result?.keyPoints) ? doc.result?.keyPoints : [],
            difficulties: Array.isArray(doc.result?.difficulties)
                ? doc.result?.difficulties
                : [],
            suggestions: Array.isArray(doc.result?.suggestions)
                ? doc.result?.suggestions
                : [],
            tags: Array.isArray(doc.result?.tags) ? doc.result?.tags : [],
            errorMessage: doc.errorMessage ?? "",
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || "服务器错误" },
            { status: 500 }
        );
    }
}