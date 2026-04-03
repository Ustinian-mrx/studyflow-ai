"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleUpload() {
        setError("");

        if (!file) {
            setError("请先选择文件");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "上传失败");
                return;
            }

            // 上传成功后直接进入对应结果页，后续状态由结果页轮询更新。
            router.push(`/result/${data.id}`);
        } catch {
            setError("网络异常，请稍后重试");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="上传资料"
                description="支持 PDF 和图片，上传后将自动生成分析结果。"
            />

            <SectionCard title="选择文件">
                <div className="space-y-4">
                    <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) => {
                            const selected = e.target.files?.[0] || null;
                            setFile(selected);
                        }}
                    />

                    {file ? (
                        <div className="text-sm text-slate-600">
                            已选择：{file.name}（{Math.ceil(file.size / 1024)} KB）
                        </div>
                    ) : null}

                    {error ? <div className="text-sm text-red-500">{error}</div> : null}

                    <Button onClick={handleUpload} disabled={loading}>
                        {loading ? "上传中..." : "开始分析"}
                    </Button>
                </div>
            </SectionCard>
        </div>
    );
}
