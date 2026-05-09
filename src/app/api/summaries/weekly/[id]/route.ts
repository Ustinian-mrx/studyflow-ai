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
    // 周总结详情路由参数使用 summary 主键 id。
    const summaryId = Number(id);

    if (Number.isNaN(summaryId)) {
      return NextResponse.json({ error: "无效的周总结 id" }, { status: 400 });
    }

    const summary = await prisma.summary.findFirst({
      where: {
        id: summaryId,
        userId: user.id,
        type: "weekly",
      },
      select: {
        id: true,
        title: true,
        period: true,
        periodStart: true,
        periodEnd: true,
        content: true,
        keyPoints: true,
        suggestions: true,
        createdAt: true,
      },
    });

    if (!summary) {
      return NextResponse.json(
        { error: "周总结不存在或无权访问" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: summary.id,
      type: "weekly",
      title: summary.title,
      period: summary.period ?? "",
      periodStart: summary.periodStart?.toISOString() ?? "",
      periodEnd: summary.periodEnd?.toISOString() ?? "",
      content: summary.content,
      keyPoints: Array.isArray(summary.keyPoints)
        ? summary.keyPoints.map(String)
        : [],
      suggestions: Array.isArray(summary.suggestions)
        ? summary.suggestions.map(String)
        : [],
      createdAt: summary.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "获取周总结详情失败",
      },
      { status: 500 }
    );
  }
}
