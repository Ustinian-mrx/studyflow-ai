import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ error: "缺少 documentId" }, { status: 400 });
    }

    const document = await prisma.document.findFirst({
      where: { id: Number(documentId), userId: user.id },
      include: { result: true },
    });

    if (!document) {
      return NextResponse.json({ error: "文档不存在" }, { status: 404 });
    }

    if (!document.result) {
      return NextResponse.json({ error: "该文档暂无分析结果" }, { status: 400 });
    }

    const difficulties = Array.isArray(document.result.difficulties)
      ? document.result.difficulties.map(String)
      : [];

    const resultTags = Array.isArray(document.result.tags)
      ? document.result.tags.map(String)
      : [];

    if (difficulties.length === 0) {
      return NextResponse.json({ message: "该文档无疑难点可导入", imported: 0 });
    }

    const existing = await prisma.mistakeItem.findMany({
      where: {
        userId: user.id,
        documentId: document.id,
        source: "ai_difficulty",
      },
    });

    const existingContents = new Set(existing.map((e) => e.content));

    const toCreate = difficulties
      .filter((d) => !existingContents.has(d))
      .map((content) => ({
        userId: user.id,
        documentId: document.id,
        source: "ai_difficulty" as const,
        content,
        tags: resultTags,
      }));

    if (toCreate.length === 0) {
      return NextResponse.json({ message: "疑难点已全部导入", imported: 0 });
    }

    await prisma.mistakeItem.createMany({ data: toCreate });

    return NextResponse.json({
      message: `成功导入 ${toCreate.length} 条疑难点`,
      imported: toCreate.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "导入失败" },
      { status: 500 }
    );
  }
}
