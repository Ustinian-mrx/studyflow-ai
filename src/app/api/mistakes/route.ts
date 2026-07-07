import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source") as "ai_difficulty" | "wrong_answer" | null;
    const tag = searchParams.get("tag");
    const documentId = searchParams.get("documentId");
    const mastered = searchParams.get("mastered");

    const where: Record<string, unknown> = { userId: user.id };

    if (source) where.source = source;
    if (mastered !== null && mastered !== undefined && mastered !== "") {
      where.mastered = mastered === "true";
    }
    if (documentId) where.documentId = Number(documentId);

    const items = await prisma.mistakeItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        document: { select: { id: true, filename: true } },
      },
    });

    const filtered = tag
      ? items.filter((item) => {
          const tags = Array.isArray(item.tags) ? item.tags.map(String) : [];
          return tags.includes(tag);
        })
      : items;

    const allTags = Array.from(
      new Set(
        items.flatMap((item) =>
          Array.isArray(item.tags) ? item.tags.map(String) : []
        )
      )
    );

    const documents = Array.from(
      new Map(
        items
          .filter((item) => item.document)
          .map((item) => [item.document!.id, { id: item.document!.id, name: item.document!.filename }])
      ).values()
    );

    return NextResponse.json({
      items: filtered.map((item) => ({
        id: item.id,
        content: item.content,
        answer: item.answer,
        source: item.source,
        documentId: item.documentId,
        documentName: item.document?.filename,
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
        correctCount: item.correctCount,
        wrongCount: item.wrongCount,
        mastered: item.mastered,
        createdAt: item.createdAt.toISOString(),
      })),
      tags: allTags,
      documents,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "获取错题集失败" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await req.json();
    const { content, answer, source, documentId, flashcardId, tags } = body;

    if (!content || !source) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const item = await prisma.mistakeItem.create({
      data: {
        userId: user.id,
        content,
        answer,
        source,
        documentId: documentId ? Number(documentId) : null,
        flashcardId: flashcardId ? Number(flashcardId) : null,
        tags: tags || [],
      },
    });

    return NextResponse.json({
      id: item.id,
      content: item.content,
      answer: item.answer,
      source: item.source,
      documentId: item.documentId,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      correctCount: item.correctCount,
      wrongCount: item.wrongCount,
      mastered: item.mastered,
      createdAt: item.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "添加错题失败" },
      { status: 500 }
    );
  }
}
