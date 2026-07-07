import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getDashboardData } from "@/data/api";
import type { DashboardQuickItem } from "@/data/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dashboardData = await getDashboardData();

  // 复用 dashboard 快捷入口，确保侧边栏跳转与首页入口保持一致。
  const summaryQuickItem = dashboardData.quick.find(
    (item: DashboardQuickItem) =>
      item.title === "单篇总结" || item.title === "查看总结"
  );

  const flashcardsQuickItem = dashboardData.quick.find(
    (item: DashboardQuickItem) =>
      item.title === "闪卡复习" || item.title === "查看闪卡"
  );

  const summaryHref = summaryQuickItem?.href || "/history";
  const flashcardsHref = flashcardsQuickItem?.href || "/history";

  return (
    <div className="flex min-h-screen">
      <Sidebar summaryHref={summaryHref} flashcardsHref={flashcardsHref} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
