import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFlashcardsData } from "@/data/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FlashcardsPage({ params }: Props) {
  const { id } = await params;
  const data = await getFlashcardsData(id);

  return (
    <div className="space-y-6">
      <PageHeader title="闪卡" description="用于复习的问答卡片。" />

      <SectionCard title="文档信息">
        <div className="text-sm text-slate-600">{data.documentName}</div>
      </SectionCard>

      <SectionCard title="闪卡统计">
        <div className="text-sm text-slate-600">
          共 {data.total} 张 · {data.categories} 个分类
          {data.tags.length ? ` · 标签：${data.tags.join(" / ")}` : ""}
        </div>
      </SectionCard>

      <SectionCard title="闪卡列表">
        {data.items.length === 0 ? (
          <EmptyState title="暂无闪卡" description="生成后会在这里展示。" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.items.map(
              (item: {
                id: number;
                question: string;
                answer: string;
                tags?: string[];
              }) => (
                <div key={item.id} className="rounded-md border p-4 space-y-3">
                  <div>
                    <div className="text-xs text-slate-400">问题</div>
                    <div className="mt-1 text-sm font-medium text-slate-900">
                      {item.question}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">答案</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {item.answer}
                    </div>
                  </div>

                  {item.tags?.length ? (
                    <div className="text-xs text-slate-400">
                      标签：{item.tags.join(" / ")}
                    </div>
                  ) : null}
                </div>
              )
            )}
          </div>
        )}
      </SectionCard>

      <SectionCard title="操作区">
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={`/result/${data.id}`}>返回分析结果</Link>
          </Button>
          <Button asChild>
            <Link href={`/summary/${data.id}`}>查看总结</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/history">返回历史</Link>
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}