"use client";

import { Button } from "@/components/ui/button";
import type { MistakeItemData } from "@/data/types";

type MistakeCardProps = {
  item: MistakeItemData;
  onToggleMastered: (id: number, mastered: boolean) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export default function MistakeCard({
  item,
  onToggleMastered,
  onDelete,
  loading,
}: MistakeCardProps) {
  const total = item.correctCount + item.wrongCount;
  const masteryRate = total > 0 ? Math.round((item.correctCount / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-white/60 bg-white/85 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                item.mastered
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {item.mastered ? "已掌握" : "未掌握"}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {item.source === "ai_difficulty" ? "AI 疑难点" : "闪卡答错"}
            </span>
            {item.documentName && (
              <span className="text-xs text-slate-400 truncate">
                {item.documentName}
              </span>
            )}
          </div>

          <div className="text-sm font-medium text-slate-900 mb-1">
            {item.content}
          </div>

          {item.answer && (
            <div className="text-sm text-slate-600 mb-2">
              <span className="text-xs text-slate-400">答案：</span>
              {item.answer}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {item.tags.length > 0 && (
              <span>标签：{item.tags.join(" / ")}</span>
            )}
            <span>
              答对 {item.correctCount} / 答错 {item.wrongCount}
            </span>
            <span>掌握率 {masteryRate}%</span>
            <span>{item.createdAt}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <Button
            variant={item.mastered ? "secondary" : "default"}
            size="xs"
            onClick={() => onToggleMastered(item.id, !item.mastered)}
            disabled={loading}
          >
            {item.mastered ? "标记未掌握" : "标记掌握"}
          </Button>
          <Button
            variant="destructive"
            size="xs"
            onClick={() => onDelete(item.id)}
            disabled={loading}
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}
