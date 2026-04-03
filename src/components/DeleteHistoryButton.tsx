"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
    id: number;
};

export default function DeleteHistoryButton({ id }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        // 删除属于高风险操作，先二次确认避免误删。
        const ok = window.confirm("确定要删除这条历史记录吗？删除后无法恢复。");
        if (!ok) return;

        setLoading(true);

        try {
            const res = await fetch(`/api/history/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "删除失败");
                return;
            }

            router.refresh();
        } catch {
            alert("网络异常，请稍后重试");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? "删除中..." : "删除"}
        </Button>
    );
}
