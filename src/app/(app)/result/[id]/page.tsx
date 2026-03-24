import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProcessingSteps, getResultData } from "@/data/api";
import { statusLabel } from "@/lib/status";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const data = await getResultData(id);
  const processingSteps = await getProcessingSteps();
  const isProcessing = ["uploading", "extracting", "analyzing"].includes(data.status);
  const isFailed = data.status === "failed";
  const isDone = data.status === "done";

  return (
    <div className="space-y-6">
      <PageHeader title="分析结果" description="查看 AI 解析后的核心内容。" />

      <SectionCard title="文档基础信息">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>{data.filename}</span>
          <span className="text-slate-400">·</span>
          <span>{String(data.uploadedAt)}</span>
          <span className="text-slate-400">·</span>
          <span>当前状态：</span>
          <StatusBadge status={data.status} />
        </div>
      </SectionCard>

      {isProcessing ? (
        <SectionCard title="分析状态">
          <div className="space-y-3 text-sm">
            <div>
              当前阶段：
              <span className="ml-1 font-medium text-slate-900">
                {statusLabel[data.status]}
              </span>
            </div>
            <ul className="space-y-2">
              {processingSteps.map((step) => {
                const active = step.key === data.status;
                return (
                  <li key={step.key} className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active ? "bg-slate-900" : "bg-slate-300"
                      }`}
                    />
                    <span className={active ? "text-slate-900" : "text-slate-500"}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </SectionCard>
      ) : null}

      {isFailed ? (
        <SectionCard title="处理失败">
          <EmptyState
            title="解析失败"
            description={data.errorMessage ?? "请稍后重试。"}
            action={
              <Button size="sm" variant="outline" disabled>
                重新尝试
              </Button>
            }
          />
        </SectionCard>
      ) : null}

      {!isDone ? (
        <SectionCard title="结果预览">
          <EmptyState
            title={isProcessing ? "结果生成中" : "暂无结果"}
            description="处理完成后会在此展示分析内容。"
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard title="摘要">{data.summary}</SectionCard>

          <SectionCard title="知识点">
            <ul className="list-disc pl-5">
              {data.keyPoints.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="疑难点">
            <ul className="list-disc pl-5">
              {data.difficulties.map((item: string) => (
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

          <SectionCard title="标签">{data.tags.join(" / ")}</SectionCard>
        </>
      )}

      <SectionCard title="操作区">
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/flashcards/1">查看闪卡</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/summary/1">查看总结</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/history">返回历史</Link>
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
