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

    const flashcards = await prisma.flashcard.findMany({
      where: { documentId },
      orderBy: { id: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        tags: true,
      },
    });

    const mergedTags = Array.from(
      new Set(
        flashcards.flatMap((item) =>
          Array.isArray(item.tags) ? item.tags.map(String) : []
        )
      )
    );

    return NextResponse.json({
      id: document.id,
      documentName: document.filename,
      total: flashcards.length,
      categories: mergedTags.length,
      tags: mergedTags,
      items: flashcards.map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "获取闪卡失败",
      },
      { status: 500 }
    );
  }
}
