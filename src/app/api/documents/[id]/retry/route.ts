import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processDocumentAnalysis } from "@/lib/services/document-analysis";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
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
    });

    if (!document) {
      return NextResponse.json(
        { error: "文档不存在或无权访问" },
        { status: 404 }
      );
    }

    // 先清理旧结果，避免重试后出现新旧分析数据混合。
    await prisma.flashcard.deleteMany({
      where: { documentId },
    });

    await prisma.analysisResult.deleteMany({
      where: { documentId },
    });

    await prisma.summary.deleteMany({
      where: {
        userId: user.id,
        documentId,
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
