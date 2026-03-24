import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSummaryData } from "@/data/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;
  const data = await getSummaryData(id);

  return (
    <div className="space-y-6">
      <PageHeader title="总结" description="查看单篇或阶段总结。" />

      <SectionCard title="总结信息">
        <div className="space-y-1 text-sm text-slate-600">
          <div>标题：{data.title}</div>
          <div>类型：{data.type === "single" ? "单篇总结" : "周总结"}</div>
          <div>周期：{data.period}</div>
          <div>生成时间：{String(data.generatedAt)}</div>
        </div>
      </SectionCard>

      <SectionCard title="总结内容">{data.content}</SectionCard>

      <SectionCard title="总结要点">
        <ul className="list-disc pl-5">
          {data.keyPoints.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="学习建议">
        <ul className="list-disc pl-5">
          {data.suggestions.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="操作区">
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/result/1">返回结果</Link>
          </Button>
          <Button asChild>
            <Link href="/flashcards/1">查看闪卡</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/history">返回历史</Link>
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
