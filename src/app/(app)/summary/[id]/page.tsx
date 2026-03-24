import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSummaryData } from "@/data/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;
  const data = await getSummaryData(id);

  const hasContent =
    !!data.content || data.keyPoints.length > 0 || data.suggestions.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader title="总结" description="查看单篇总结内容。" />

      <SectionCard title="总结信息">
        <div className="space-y-1 text-sm text-slate-600">
          <div>标题：{data.title || "暂无标题"}</div>
          <div>类型：{data.type === "single" ? "单篇总结" : "阶段总结"}</div>
          <div>周期：{data.period || "暂无"}</div>
          <div>生成时间：{data.generatedAt || "暂无"}</div>
        </div>
      </SectionCard>

      {!hasContent ? (
        <SectionCard title="总结内容">
          <EmptyState
            title="暂无总结"
            description="当前文档还没有生成总结，请稍后再看。"
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard title="总结内容">
            {data.content || "暂无总结内容"}
          </SectionCard>

          <SectionCard title="总结要点">
            {data.keyPoints.length === 0 ? (
              <div className="text-sm text-slate-500">暂无总结要点</div>
            ) : (
              <ul className="list-disc pl-5">
                {data.keyPoints.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="学习建议">
            {data.suggestions.length === 0 ? (
              <div className="text-sm text-slate-500">暂无学习建议</div>
            ) : (
              <ul className="list-disc pl-5">
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
            <Link href={`/result/${id}`}>返回分析结果</Link>
          </Button>
          <Button asChild>
            <Link href={`/flashcards/${id}`}>查看闪卡</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/history">返回历史</Link>
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}