import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        documents: true,
        summaries: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const flashcardsCount = await prisma.flashcard.count({
      where: {
        documentId: {
          in: user.documents.map((d) => d.id),
        },
      },
    });

    // 目前先从文档名推导标签，作为轻量化画像占位方案。
    const derivedTags = Array.from(
      new Set(
        user.documents
          .map((doc) => doc.filename.split(".")[0]?.trim())
          .filter(Boolean)
          .slice(0, 6)
      )
    );

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      tags: derivedTags.length > 0 ? derivedTags : ["暂未生成学习标签"],
      stats: {
        documents: user.documents.length,
        flashcards: flashcardsCount,
        summaries: user.summaries.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "获取个人信息失败",
      },
      { status: 500 }
    );
  }
}
