import { getMistakesPageData } from "@/data/api";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MistakesClient from "@/components/MistakesClient";

export default async function MistakesPage() {
  const data = await getMistakesPageData();

  if (!data.isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="mb-6 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">错题集</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            汇总 AI 疑难点和闪卡答错记录，帮助你针对性复习。
          </p>
        </div>
        <EmptyState
          title="请先登录"
          description="登录后即可查看你的错题集。"
          action={
            <Button asChild>
              <Link href="/login">去登录</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <MistakesClient
      initialItems={data.items}
      initialStats={data.stats}
      initialTags={data.tags}
      initialDocuments={data.documents}
    />
  );
}
