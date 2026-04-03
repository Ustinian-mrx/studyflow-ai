import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { getWeeklySummaries } from "@/data/api";
import type { WeeklySummaryListItem } from "@/data/types";

export default async function SummariesPage() {
  // 周总结列表是 summary 资源视图，不再复用 documentId 路由。
  const items = await getWeeklySummaries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="周总结"
        description="查看每周学习复盘与阶段性建议。"
      />

      <SectionCard title="周总结列表">
        {items.length === 0 ? (
          <EmptyState
            title="暂无周总结"
            description="等你积累更多学习记录后，这里会展示每周复盘。"
            action={
              <Button asChild size="sm">
                <Link href="/upload">去上传资料</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {items.map((item: WeeklySummaryListItem) => (
              <Link
                key={item.id}
                href={`/summaries/weekly/${item.id}`}
                className="block rounded-lg border p-4 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      周期：{item.period || "暂无"}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    {item.createdAt
                      ? item.createdAt.replace("T", " ").slice(0, 16)
                      : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
