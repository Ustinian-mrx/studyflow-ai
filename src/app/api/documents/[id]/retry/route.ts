import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processDocumentAnalysis } from "@/lib/services/document-analysis";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const documentId = Number(id);
    const mockUserId = 1;

    if (Number.isNaN(documentId)) {
      return NextResponse.json({ error: "无效的文档 id" }, { status: 400 });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: mockUserId,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "文档不存在" }, { status: 404 });
    }

    await prisma.flashcard.deleteMany({
      where: { documentId },
    });

    await prisma.analysisResult.deleteMany({
      where: { documentId },
    });

    await prisma.summary.deleteMany({
      where: {
        userId: mockUserId,
        title: `${document.filename} - 单篇总结`,
        type: "single",
      },
    });

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "uploading",
        errorMessage: null,
      },
    });

    await processDocumentAnalysis(documentId);

    return NextResponse.json({
      success: true,
      message: "已重新触发分析",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "重试分析失败",
      },
      { status: 500 }
    );
  }
}
