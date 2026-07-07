"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FlashcardItem } from "@/data/types";

type ReviewModeProps = {
  items: FlashcardItem[];
  documentId: number;
  onFinish: () => void;
};

type ReviewResult = {
  id: number;
  correct: boolean;
};

export default function ReviewMode({ items, documentId, onFinish }: ReviewModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [saving, setSaving] = useState(false);

  const currentItem = items[currentIndex];
  const isFinished = currentIndex >= items.length;

  async function handleAnswer(correct: boolean) {
    if (!currentItem) return;

    setResults((prev) => [...prev, { id: currentItem.id, correct }]);

    if (!correct) {
      setSaving(true);
      try {
        await fetch("/api/mistakes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: currentItem.question,
            answer: currentItem.answer,
            source: "wrong_answer",
            documentId,
            flashcardId: currentItem.id,
            tags: currentItem.tags || [],
          }),
        });
      } catch {
        // 静默处理，不影响复习流程
      } finally {
        setSaving(false);
      }
    }

    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  }

  if (isFinished) {
    const correctCount = results.filter((r) => r.correct).length;
    const wrongCount = results.filter((r) => !r.correct).length;
    const rate = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur-sm text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">复习完成</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-2xl font-bold text-slate-900">{results.length}</div>
              <div className="text-xs text-slate-500">总题数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-xs text-slate-500">答对</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-xs text-slate-500">答错（已加入错题集）</div>
            </div>
          </div>
          <div className="text-sm text-slate-600 mb-4">
            正确率：<span className="font-semibold">{rate}%</span>
          </div>
          <Button onClick={onFinish}>返回闪卡列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          进度：{currentIndex + 1} / {items.length}
        </span>
        <span>
          答对 {results.filter((r) => r.correct).length} · 答错{" "}
          {results.filter((r) => !r.correct).length}
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="rounded-xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
        <div className="text-xs text-slate-400 mb-2">问题</div>
        <div className="text-base font-medium text-slate-900 mb-6">
          {currentItem.question}
        </div>

        {showAnswer ? (
          <>
            <div className="text-xs text-slate-400 mb-2">答案</div>
            <div className="text-sm text-slate-700 mb-6">{currentItem.answer}</div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleAnswer(true)}
                disabled={saving}
              >
                掌握了
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                onClick={() => handleAnswer(false)}
                disabled={saving}
              >
                没掌握
              </Button>
            </div>
          </>
        ) : (
          <Button className="w-full" onClick={() => setShowAnswer(true)}>
            显示答案
          </Button>
        )}
      </div>
    </div>
  );
}
