import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const documentId = Number(id);

    if (Number.isNaN(documentId)) {
      return NextResponse.json({ error: "无效的文档 id" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "文档不存在" }, { status: 404 });
    }

    const summary = await prisma.summary.findFirst({
      where: {
        userId: document.userId,
        type: "single",
        title: `${document.filename} - 单篇总结`,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!summary) {
      return NextResponse.json({
        id: document.id,
        type: "single",
        title: `${document.filename} - 单篇总结`,
        period: "",
        content: "",
        keyPoints: [],
        suggestions: [],
        generatedAt: "",
      });
    }

    return NextResponse.json({
      id: document.id,
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
      {
        error: (error as Error).message || "获取总结失败",
      },
      { status: 500 }
    );
  }
}