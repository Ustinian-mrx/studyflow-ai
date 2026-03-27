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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar summaryHref={summaryHref} flashcardsHref={flashcardsHref} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
