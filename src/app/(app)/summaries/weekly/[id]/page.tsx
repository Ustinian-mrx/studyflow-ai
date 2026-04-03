import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { getWeeklySummaryDetail } from "@/data/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WeeklySummaryDetailPage({ params }: Props) {
  const { id } = await params;
  // 这里的 id 是 weekly summary 主键，而不是文档 id。
  const data = await getWeeklySummaryDetail(id);

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="周总结详情"
          description="查看某一周的学习复盘内容。"
        />

        <SectionCard title="周总结内容">
          <EmptyState
            title="暂无可查看的周总结"
            description="这条周总结不存在，或者你当前没有访问权限。"
            action={
              <Button asChild size="sm">
                <Link href="/summaries">返回周总结列表</Link>
              </Button>
            }
          />
        </SectionCard>
      </div>
    );
  }

  const hasContent =
    !!data.content || data.keyPoints.length > 0 || data.suggestions.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="周总结详情"
        description="查看某一周的学习复盘内容。"
      />

      <SectionCard title="总结信息">
        <div className="space-y-1 text-sm text-slate-600">
          <div>标题：{data.title}</div>
          <div>类型：周总结</div>
          <div>周期：{data.period || "暂无"}</div>
          <div>
            起止时间：
            {data.periodStart && data.periodEnd
              ? `${data.periodStart.replace("T", " ").slice(0, 16)} ~ ${data.periodEnd.replace("T", " ").slice(0, 16)}`
              : "暂无"}
          </div>
          <div>
            生成时间：
            {data.createdAt
              ? data.createdAt.replace("T", " ").slice(0, 16)
              : "暂无"}
          </div>
        </div>
      </SectionCard>

      {!hasContent ? (
        <SectionCard title="总结内容">
          <EmptyState
            title="暂无内容"
            description="当前周总结还没有生成完整内容。"
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard title="总结内容">
            <div className="text-sm leading-7 text-slate-700">
              {data.content || "暂无总结内容"}
            </div>
          </SectionCard>

          <SectionCard title="总结要点">
            {data.keyPoints.length === 0 ? (
              <div className="text-sm text-slate-500">暂无总结要点</div>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                {data.keyPoints.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="下周建议">
            {data.suggestions.length === 0 ? (
              <div className="text-sm text-slate-500">暂无建议</div>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                {data.suggestions.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </SectionCard>
        </>
      )}

      <SectionCard title="操作区">
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/summaries">返回周总结列表</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">返回控制台</Link>
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
