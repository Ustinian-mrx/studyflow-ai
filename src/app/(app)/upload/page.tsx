"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { Button } from "@/components/ui/button";

const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const dragCounterRef = useRef(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadAbortRef = useRef<AbortController | null>(null);

    function isAllowedFile(nextFile: File) {
        return ACCEPTED_FILE_TYPES.includes(nextFile.type);
    }

    function applySelectedFile(nextFile: File | null) {
        setError("");
        setNotice("");

        if (!nextFile) {
            setFile(null);
            return;
        }

        if (!isAllowedFile(nextFile)) {
            setError("仅支持 PDF、PNG、JPG、JPEG、WEBP 文件");
            return;
        }

        setFile(nextFile);
    }

    async function handleUpload() {
        setError("");
        setNotice("");

        if (!file) {
            setError("请先选择文件");
            return;
        }

        setLoading(true);
        const controller = new AbortController();
        uploadAbortRef.current = controller;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "上传失败");
                return;
            }

            // 上传成功后直接进入对应结果页，后续状态由结果页轮询更新。
            router.push(`/result/${data.id}`);
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                setNotice("上传请求已取消。若服务端已开始处理，可在历史记录中查看状态。");
                return;
            }

            setError("网络异常，请稍后重试");
        } finally {
            uploadAbortRef.current = null;
            setLoading(false);
        }
    }

    function handleCancelUpload() {
        if (!uploadAbortRef.current) return;
        uploadAbortRef.current.abort();
    }

    function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        dragCounterRef.current += 1;
        setDragActive(true);
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
        if (!dragActive) setDragActive(true);
    }

    function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
            setDragActive(false);
            dragCounterRef.current = 0;
        }
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        dragCounterRef.current = 0;

        const droppedFile = event.dataTransfer.files?.[0] || null;
        applySelectedFile(droppedFile);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="上传资料"
                description="支持 PDF 和图片，上传后将自动生成分析结果。"
            />

            <SectionCard title="选择文件">
                <div className="space-y-4">
                    <div
                        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                            dragActive
                                ? "border-indigo-400 bg-indigo-50/70"
                                : "border-slate-300 bg-slate-50/70"
                        }`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">
                                拖拽文件到这里，或点击下方按钮选择文件
                            </p>
                            <p className="text-xs text-slate-500">
                                支持 PDF、PNG、JPG、JPEG、WEBP，最大 10MB
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                                const selected = e.target.files?.[0] || null;
                                applySelectedFile(selected);
                            }}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            选择本地文件
                        </Button>
                    </div>

                    {file ? (
                        <div className="text-sm text-slate-600">
                            已选择：{file.name}（{Math.ceil(file.size / 1024)} KB）
                        </div>
                    ) : null}

                    {error ? <div className="text-sm text-red-500">{error}</div> : null}
                    {notice ? <div className="text-sm text-amber-600">{notice}</div> : null}

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleUpload} disabled={loading}>
                            {loading ? "上传中..." : "开始分析"}
                        </Button>
                        {loading ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelUpload}
                            >
                                取消上传
                            </Button>
                        ) : null}
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}
