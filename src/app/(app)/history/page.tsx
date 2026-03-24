import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import ListItem from "@/components/ListItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHistoryList } from "@/data/api";

export default async function HistoryPage() {
  const historyList = await getHistoryList();
  return (
    <div className="space-y-6">
      <PageHeader title="历史记录" description="查看你上传过的所有资料。" />

      <SectionCard title="记录列表">
        {historyList.length === 0 ? (
          <EmptyState
            title="暂无记录"
            description="上传资料后会显示在这里。"
            action={
              <Button asChild size="sm">
                <Link href="/upload">去上传</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {historyList.map((item: { id: number; name: string; time: string; status: string }) => (
              <ListItem
                key={item.id}
                title={item.name}
                subtitle={item.time}
                right={<StatusBadge status={item.status as any} />}
                href={`/result/${item.id}`}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}