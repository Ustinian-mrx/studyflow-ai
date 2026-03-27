import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/data/api";
import type {
  DashboardQuickItem,
  HistoryItem,
} from "@/data/types";

type OutputItem = {
  id: number;
  title: string;
  value: string;
  desc: string;
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data.isAuthenticated) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="学习控制台"
          description="登录后可以查看你的上传记录、总结和学习进度。"
        />

        <SectionCard title="开始使用">
          <EmptyState
            title="你还没有登录"
            description="登录后即可上传资料、生成闪卡和查看总结。"
            action={
              <div className="flex gap-3">
                <Button asChild size="sm">
                  <Link href="/login">去登录</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/register">去注册</Link>
                </Button>
              </div>
            }
          />
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="学习控制台"
        description="欢迎回来，今天想整理哪份资料？"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {data.quick.map((item: DashboardQuickItem, index: number) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border p-6 min-h-32 flex flex-col justify-between
text-lg font-semibold transition hover:scale-[1.02] hover:shadow-lg
${
  index % 4 === 0
    ? "bg-gradient-to-r from-slate-900 to-slate-700 text-white"
    : index % 4 === 1
      ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
      : index % 4 === 2
        ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white"
        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
}`}
          >
            <div>
              <div>{item.title}</div>
              {item.description ? (
                <div className="mt-2 text-sm font-normal opacity-85">
                  {item.description}
                </div>
              ) : null}
            </div>
            <span className="text-sm opacity-80 self-end">→</span>
          </Link>
        ))}
      </div>

      <SectionCard title="最近上传记录">
        {data.recentUploads.length === 0 ? (
          <EmptyState
            title="还没有上传记录"
            description="先上传第一份学习资料，系统会自动为你生成结果。"
            action={
              <Button asChild size="sm">
                <Link href="/upload">去上传</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {data.recentUploads.map((item: HistoryItem) => (
              <Link
                key={item.id}
                href={`/result/${item.id}`}
                className="block rounded-md border p-3 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="最近生成内容">
        {data.recentOutputs.length === 0 ? (
          <div className="text-sm text-slate-500">暂无统计数据</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {data.recentOutputs.map((item: OutputItem) => (
              <div key={item.id} className="rounded-md border p-4">
                <div className="text-sm text-slate-500">{item.title}</div>
                <div className="mt-1 text-xl font-semibold">{item.value}</div>
                <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
