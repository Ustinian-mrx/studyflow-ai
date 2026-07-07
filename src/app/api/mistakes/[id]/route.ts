import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const itemId = Number(id);

    if (Number.isNaN(itemId)) {
      return NextResponse.json({ error: "无效的 id" }, { status: 400 });
    }

    const existing = await prisma.mistakeItem.findFirst({
      where: { id: itemId, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "错题不存在" }, { status: 404 });
    }

    const body = await req.json();
    const { mastered, correctCount, wrongCount } = body;

    const item = await prisma.mistakeItem.update({
      where: { id: itemId },
      data: {
        ...(mastered !== undefined && { mastered }),
        ...(correctCount !== undefined && { correctCount }),
        ...(wrongCount !== undefined && { wrongCount }),
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
      { error: (error as Error).message || "更新错题失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const itemId = Number(id);

    if (Number.isNaN(itemId)) {
      return NextResponse.json({ error: "无效的 id" }, { status: 400 });
    }

    const existing = await prisma.mistakeItem.findFirst({
      where: { id: itemId, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "错题不存在" }, { status: 404 });
    }

    await prisma.mistakeItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "删除错题失败" },
      { status: 500 }
    );
  }
}
