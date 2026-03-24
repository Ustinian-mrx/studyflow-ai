import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { getProfileData } from "@/data/api";

export default async function ProfilePage() {
  const data = await getProfileData();

  return (
    <div className="space-y-6">
      <PageHeader title="个人中心" description="管理你的基础信息与设置。" />

      <SectionCard title="用户信息">
        <div className="space-y-1 text-sm text-slate-600">
          <div>昵称：{data.name}</div>
          <div>邮箱：{data.email}</div>
          <div>身份类型：{data.role}</div>
        </div>
      </SectionCard>

      <SectionCard title="学习档案概览">
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <div className="rounded-md border p-3">
            <div className="text-xs text-slate-400">已上传资料</div>
            <div className="text-lg font-medium text-slate-900">
              {data.stats.documents}
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-slate-400">闪卡数量</div>
            <div className="text-lg font-medium text-slate-900">
              {data.stats.flashcards}
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-slate-400">总结次数</div>
            <div className="text-lg font-medium text-slate-900">
              {data.stats.summaries}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="学习标签">
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          {data.tags.map((tag: string) => (
            <span key={tag} className="rounded-full border px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="账号操作">
        <div className="text-sm text-slate-500">可在右上角菜单中退出登录。</div>
      </SectionCard>
    </div>
  );
}
