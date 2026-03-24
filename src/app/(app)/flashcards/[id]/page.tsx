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
        共 {data.total} 张 · {data.categories} 个分类 · 标签：{data.tags.join(" / ")}
      </SectionCard>

      <SectionCard title="闪卡列表">
        {data.items.length === 0 ? (
          <EmptyState title="暂无闪卡" description="生成后会在这里展示。" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.items.map((item: { id: number; question: string; answer: string; tags?: string[] }) => (
              <div key={item.id} className="rounded-md border p-4">
                <div className="text-sm font-medium">Q：{item.question}</div>
                <div className="mt-2 text-sm text-slate-500">A：{item.answer}</div>
                {item.tags?.length ? (
                  <div className="mt-3 text-xs text-slate-400">
                    标签：{item.tags.join(" / ")}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="操作区">
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/result/1">返回分析结果</Link>
          </Button>
          <Button asChild>
            <Link href="/summary/1">查看总结</Link>
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
