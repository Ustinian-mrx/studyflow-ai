import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import { getDashboardData } from "@/data/api";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <div className="space-y-6">
      <PageHeader
        title="学习控制台"
        description="欢迎回来，今天想整理哪份资料？"
      />

      {/* 快捷操作 */}
      <div className="grid gap-4 md:grid-cols-2">
        {data.quick.map((item: { title: string; href: string }, index: number) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border p-6 h-28 flex items-center justify-between
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
            {item.title}
            <span className="text-sm opacity-80">→</span>
          </Link>
        ))}
      </div>

      {/* 最近上传记录 */}
      <SectionCard title="最近上传记录">
        <div className="space-y-3">
          {data.recentUploads.map((item: { id: number; name: string; time: string; status: string }) => (
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
                <StatusBadge status={item.status as any} />
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* 最近生成内容 */}
      <SectionCard title="最近生成内容">
        <div className="grid gap-3 md:grid-cols-2">
          {data.recentOutputs.map((item: { id: number; title: string; value: string; desc: string }) => (
            <div key={item.id} className="rounded-md border p-4">
              <div className="text-sm text-slate-500">{item.title}</div>
              <div className="mt-1 text-xl font-semibold">{item.value}</div>
              <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
