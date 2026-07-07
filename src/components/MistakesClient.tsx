"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import MistakeCard from "@/components/MistakeCard";
import MistakeFilters from "@/components/MistakeFilters";
import ExportButtons from "@/components/ExportButtons";
import type { MistakeItemData, MistakeStats } from "@/data/types";

type Props = {
  initialItems: MistakeItemData[];
  initialStats: MistakeStats;
  initialTags: string[];
  initialDocuments: { id: number; name: string }[];
};

export default function MistakesClient({
  initialItems,
  initialStats,
  initialTags,
  initialDocuments,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);

  const [selectedSource, setSelectedSource] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedMastered, setSelectedMastered] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedSource && item.source !== selectedSource) return false;
      if (selectedMastered !== "" && item.mastered !== (selectedMastered === "true")) return false;
      if (selectedTag && !item.tags.includes(selectedTag)) return false;
      if (selectedDocument && item.documentId !== Number(selectedDocument)) return false;
      return true;
    });
  }, [items, selectedSource, selectedTag, selectedDocument, selectedMastered]);

  async function refreshData() {
    setLoading(true);
    try {
      const res = await fetch("/api/mistakes");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
      const statsRes = await fetch("/api/mistakes/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleMastered(id: number, mastered: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`/api/mistakes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mastered }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("确定要删除这条错题吗？")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/mistakes/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshData();
      }
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="错题集"
        description="汇总 AI 疑难点和闪卡答错记录，帮助你针对性复习。"
      />

      <SectionCard title="统计概览">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500">总题数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
            <div className="text-xs text-slate-500">已掌握</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{stats.unmastered}</div>
            <div className="text-xs text-slate-500">未掌握</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="筛选与导出">
        <div className="space-y-4">
          <MistakeFilters
            tags={initialTags}
            documents={initialDocuments}
            selectedSource={selectedSource}
            selectedTag={selectedTag}
            selectedDocument={selectedDocument}
            selectedMastered={selectedMastered}
            onSourceChange={setSelectedSource}
            onTagChange={setSelectedTag}
            onDocumentChange={setSelectedDocument}
            onMasteredChange={setSelectedMastered}
          />
          <ExportButtons disabled={items.length === 0} />
        </div>
      </SectionCard>

      <SectionCard title={`错题列表（${filteredItems.length}）`}>
        {filteredItems.length === 0 ? (
          <EmptyState
            title="暂无错题"
            description={
              items.length === 0
                ? "还没有错题记录，上传文档分析或复习闪卡时答错的题目会自动收录。"
                : "当前筛选条件下没有错题。"
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <MistakeCard
                key={item.id}
                item={item}
                onToggleMastered={handleToggleMastered}
                onDelete={handleDelete}
                loading={loading}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
