"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import ReviewMode from "@/components/ReviewMode";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FlashcardItem } from "@/data/types";

type Props = {
  id: number;
  documentName: string;
  total: number;
  categories: number;
  tags: string[];
  items: FlashcardItem[];
};

export default function FlashcardsClient({
  id,
  documentName,
  total,
  categories,
  tags,
  items,
}: Props) {
  const [isReviewing, setIsReviewing] = useState(false);

  if (isReviewing && items.length > 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="闪卡复习" description="显示答案后标记是否掌握，答错的题目会自动加入错题集。" />
        <ReviewMode
          items={items}
          documentId={id}
          onFinish={() => setIsReviewing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="闪卡" description="用于复习的问答卡片。" />

      <SectionCard title="文档信息">
        <div className="text-sm text-slate-600">{documentName}</div>
      </SectionCard>

      <SectionCard title="闪卡统计">
        <div className="text-sm text-slate-600">
          共 {total} 张 · {categories} 个分类
          {tags.length ? ` · 标签：${tags.join(" / ")}` : ""}
        </div>
      </SectionCard>

      <SectionCard title="操作区">
        <div className="flex gap-3">
          {items.length > 0 && (
            <Button onClick={() => setIsReviewing(true)}>开始复习</Button>
          )}
          <Button asChild variant="outline">
            <Link href={`/result/${id}`}>返回分析结果</Link>
          </Button>
          <Button asChild>
            <Link href={`/summary/${id}`}>查看总结</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/history">返回历史</Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="闪卡列表">
        {items.length === 0 ? (
          <EmptyState title="暂无闪卡" description="生成后会在这里展示。" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-md border p-4 space-y-3">
                <div>
                  <div className="text-xs text-slate-400">问题</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {item.question}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">答案</div>
                  <div className="mt-1 text-sm text-slate-600">{item.answer}</div>
                </div>

                {item.tags?.length ? (
                  <div className="text-xs text-slate-400">
                    标签：{item.tags.join(" / ")}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
