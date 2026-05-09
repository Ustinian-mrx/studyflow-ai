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
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    // 这里的 [id] 语义是 documentId，不是 summary 主键 id。
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
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "文档不存在或无权访问" },
        { status: 404 }
      );
    }

    const summary = await prisma.summary.findFirst({
      where: {
        userId: user.id,
        documentId,
        type: "single",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        title: true,
        period: true,
        content: true,
        keyPoints: true,
        suggestions: true,
        createdAt: true,
      },
    });

    if (!summary) {
      return NextResponse.json({
        documentId: document.id,
        summaryId: null,
        documentName: document.filename,
        type: "single",
        title: `${document.filename} — 单篇总结`,
        period: "",
        content: "",
        keyPoints: [],
        suggestions: [],
        generatedAt: "",
      });
    }

    return NextResponse.json({
      documentId: document.id,
      summaryId: summary.id,
      documentName: document.filename,
      type: summary.type,
      title: summary.title,
      period: summary.period,
      content: summary.content,
      keyPoints: Array.isArray(summary.keyPoints)
        ? summary.keyPoints.map(String)
        : [],
      suggestions: Array.isArray(summary.suggestions)
        ? summary.suggestions.map(String)
        : [],
      generatedAt: summary.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "获取总结失败" },
      { status: 500 }
    );
  }
}
