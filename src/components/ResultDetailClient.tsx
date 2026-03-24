"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { statusLabel, type StatusKey } from "@/lib/status";

type ResultData = {
    id: number;
    filename: string;
    uploadedAt: string;
    status: StatusKey;
    summary: string;
    keyPoints: string[];
    difficulties: string[];
    suggestions: string[];
    tags: string[];
    errorMessage?: string;
};

type ProcessingStep = {
    key: StatusKey;
    label: string;
};

type Props = {
    id: string;
    initialData?: ResultData | null;
    processingSteps: ProcessingStep[];
};

export default function ResultDetailClient({
    id,
    initialData,
    processingSteps,
}: Props) {
    const [data, setData] = useState<ResultData | null>(initialData ?? null);
    const [loading, setLoading] = useState(!initialData);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string>("");
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        let stopped = false;

        async function fetchResult() {
            try {
                const res = await fetch(`/api/result/${id}`, {
                    cache: "no-store",
                });

                const json = await res.json();

                if (!res.ok) {
                    setData({
                        id: Number(id) || 0,
                        filename: "未知文件",
                        uploadedAt: "",
                        status: "failed",
                        summary: "",
                        keyPoints: [],
                        difficulties: [],
                        suggestions: [],
                        tags: [],
                        errorMessage: json.error || "加载失败",
                    });
                    setIsPolling(false);
                    setLastUpdatedAt(new Date().toLocaleTimeString());
                    return;
                }

                setData(json);
                setLastUpdatedAt(new Date().toLocaleTimeString());

                const shouldPoll = ["uploading", "extracting", "analyzing"].includes(
                    json.status
                );

                setIsPolling(shouldPoll);

                if (shouldPoll && !stopped) {
                    timer = setTimeout(fetchResult, 2000);
                }
            } catch {
                setData({
                    id: Number(id) || 0,
                    filename: "未知文件",
                    uploadedAt: "",
                    status: "failed",
                    summary: "",
                    keyPoints: [],
                    difficulties: [],
                    suggestions: [],
                    tags: [],
                    errorMessage: "网络异常，请稍后重试",
                });
                setIsPolling(false);
                setLastUpdatedAt(new Date().toLocaleTimeString());
            } finally {
                setLoading(false);
            }
        }

        fetchResult();

        return () => {
            stopped = true;
            if (timer) clearTimeout(timer);
        };
    }, [id]);

    if (loading || !data) {
        return (
            <div className="space-y-6">
                <PageHeader title="分析结果" description="查看 AI 解析后的核心内容。" />
                <SectionCard title="加载中">
                    <div className="text-sm text-slate-500">正在加载结果...</div>
                </SectionCard>
            </div>
        );
    }

    const isProcessing = ["uploading", "extracting", "analyzing"].includes(
        data.status
    );
    const isFailed = data.status === "failed";
    const isDone = data.status === "done";

    return (
        <div className="space-y-6">
            <PageHeader title="分析结果" description="查看 AI 解析后的核心内容。" />

            <SectionCard title="文档基础信息">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span>{data.filename}</span>
                        <span className="text-slate-400">·</span>
                        <span>{String(data.uploadedAt)}</span>
                        <span className="text-slate-400">·</span>
                        <span>当前状态：</span>
                        <StatusBadge status={data.status} />
                    </div>

                    <div className="text-xs text-slate-400">
                        {isPolling ? "正在自动刷新状态..." : "状态已停止刷新"}
                        {lastUpdatedAt ? ` · 最近更新于 ${lastUpdatedAt}` : ""}
                    </div>
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
                                            className={`h-2 w-2 rounded-full ${active ? "bg-slate-900" : "bg-slate-300"
                                                }`}
                                        />
                                        <span
                                            className={active ? "text-slate-900" : "text-slate-500"}
                                        >
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
                        description={data.errorMessage || "请稍后重试。"}
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
                            {data.keyPoints.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard title="疑难点">
                        <ul className="list-disc pl-5">
                            {data.difficulties.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard title="学习建议">
                        <ul className="list-disc pl-5">
                            {data.suggestions.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard title="标签">
                        {data.tags.length ? data.tags.join(" / ") : "暂无标签"}
                    </SectionCard>
                </>
            )}

            <SectionCard title="操作区">
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href={`/flashcards/${data.id}`}>查看闪卡</Link>
                    </Button>
                    <Button asChild variant="outline">
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