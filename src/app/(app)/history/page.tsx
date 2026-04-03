import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHistoryList } from "@/data/api";
import DeleteHistoryButton from "@/components/DeleteHistoryButton";
import type { HistoryItem } from "@/data/types";

export default async function HistoryPage() {
  // 服务端直取历史列表，避免客户端首屏再发一次请求。
  const historyList = await getHistoryList();

  return (
    <div className="space-y-6">
      <PageHeader title="历史记录" description="查看你上传过的所有资料。" />

      <SectionCard title="记录列表">
        {historyList.length === 0 ? (
          <EmptyState
            title="暂无记录"
            description="你还没有上传任何资料，先去上传第一份文件吧。"
            action={
              <Button asChild size="sm">
                <Link href="/upload">去上传</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {historyList.map((item: HistoryItem) => (
              <div
                key={item.id}
                className="rounded-lg border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                  <div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* 历史记录以文档为中心，三个入口共享同一个 documentId。 */}
                  <Button asChild size="sm">
                    <Link href={`/result/${item.id}`}>查看分析</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/flashcards/${item.id}`}>查看闪卡</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/summary/${item.id}`}>查看总结</Link>
                  </Button>
                  <DeleteHistoryButton id={item.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
