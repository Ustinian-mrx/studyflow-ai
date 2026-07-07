import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const items = await prisma.mistakeItem.findMany({
      where: { userId: user.id },
      include: {
        document: { select: { id: true, filename: true } },
      },
    });

    const total = items.length;
    const mastered = items.filter((i) => i.mastered).length;
    const unmastered = total - mastered;

    const docMap = new Map<string, { count: number; masteredCount: number }>();
    const tagMap = new Map<string, { count: number; masteredCount: number }>();
    const weekMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();

    for (const item of items) {
      const docName = item.document?.filename || "未知文档";
      const docEntry = docMap.get(docName) || { count: 0, masteredCount: 0 };
      docEntry.count++;
      if (item.mastered) docEntry.masteredCount++;
      docMap.set(docName, docEntry);

      const tags = Array.isArray(item.tags) ? item.tags.map(String) : [];
      for (const tag of tags) {
        const tagEntry = tagMap.get(tag) || { count: 0, masteredCount: 0 };
        tagEntry.count++;
        if (item.mastered) tagEntry.masteredCount++;
        tagMap.set(tag, tagEntry);
      }

      const weekStart = getWeekStart(item.createdAt);
      weekMap.set(weekStart, (weekMap.get(weekStart) || 0) + 1);

      sourceMap.set(item.source, (sourceMap.get(item.source) || 0) + 1);
    }

    const byDocument = Array.from(docMap.entries())
      .map(([document, data]) => ({
        document,
        count: data.count,
        masteryRate: data.count > 0 ? Math.round((data.masteredCount / data.count) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const byTag = Array.from(tagMap.entries())
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        masteryRate: data.count > 0 ? Math.round((data.masteredCount / data.count) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const sortedWeeks = Array.from(weekMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    let cumulative = 0;
    const byWeek = sortedWeeks.map(([week, count]) => {
      cumulative += count;
      return { week, newCount: count, totalCount: cumulative };
    });

    const bySource = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source: source === "ai_difficulty" ? "AI 疑难点" : "闪卡答错",
      count,
    }));

    return NextResponse.json({
      total,
      mastered,
      unmastered,
      byDocument,
      byTag,
      byWeek,
      bySource,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "获取统计数据失败" },
      { status: 500 }
    );
  }
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}
