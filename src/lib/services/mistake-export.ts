import { prisma } from "@/lib/prisma";

export type ExportMistakeItem = {
  id: number;
  content: string;
  answer: string;
  source: string;
  documentName: string;
  tags: string[];
  correctCount: number;
  wrongCount: number;
  masteryRate: number;
  mastered: boolean;
  createdAt: string;
};

export type ExportStats = {
  total: number;
  mastered: number;
  unmastered: number;
  byDocument: { document: string; count: number; masteryRate: number }[];
  byTag: { tag: string; count: number; masteryRate: number }[];
  byWeek: { week: string; newCount: number; totalCount: number }[];
  bySource: { source: string; count: number }[];
};

export async function getExportData(userId: number) {
  const items = await prisma.mistakeItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      document: { select: { id: true, filename: true } },
    },
  });

  const exportItems: ExportMistakeItem[] = items.map((item) => {
    const total = item.correctCount + item.wrongCount;
    return {
      id: item.id,
      content: item.content,
      answer: item.answer || "",
      source: item.source === "ai_difficulty" ? "AI 疑难点" : "闪卡答错",
      documentName: item.document?.filename || "未知文档",
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      correctCount: item.correctCount,
      wrongCount: item.wrongCount,
      masteryRate: total > 0 ? Math.round((item.correctCount / total) * 100) : 0,
      mastered: item.mastered,
      createdAt: item.createdAt.toISOString().split("T")[0],
    };
  });

  const total = items.length;
  const mastered = items.filter((i) => i.mastered).length;

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

  const stats: ExportStats = {
    total,
    mastered,
    unmastered: total - mastered,
    byDocument,
    byTag,
    byWeek,
    bySource,
  };

  return { items: exportItems, stats };
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}
