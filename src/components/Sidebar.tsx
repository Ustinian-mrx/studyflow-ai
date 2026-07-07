"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  summaryHref?: string;
  flashcardsHref?: string;
};

export default function Sidebar({
  summaryHref = "/history",
  flashcardsHref = "/history",
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "首页", href: "/dashboard" },
    { name: "上传", href: "/upload" },
    { name: "历史记录", href: "/history" },
    { name: "闪卡", href: flashcardsHref },
    { name: "单篇总结", href: summaryHref },
    { name: "周总结", href: "/summaries" },
    { name: "个人中心", href: "/profile" },
  ];

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/40 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 px-5 py-6 text-white shadow-xl lg:block">
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs tracking-wide text-white/90">
          StudyFlow Workspace
        </div>
        <div className="text-2xl font-semibold tracking-tight">StudyFlow AI</div>
        <p className="text-sm text-indigo-100/80">上传资料，生成分析，持续复习。</p>
      </div>
      <nav className="space-y-1.5 text-sm">
        {navItems.map((item) => {
          // 动态入口使用 startsWith 匹配，保证不同 id 页面也能高亮。
          const active =
            item.name === "闪卡"
              ? pathname.startsWith("/flashcards")
              : item.name === "单篇总结"
                ? pathname.startsWith("/summary")
                : item.name === "周总结"
                  ? pathname.startsWith("/summaries")
                  : pathname.startsWith(item.href);

          return (
            <Link
              key={`${item.name}-${item.href}`}
              href={item.href}
              className={`block rounded-xl px-3 py-2.5 transition ${
                active
                  ? "bg-white/22 font-medium text-white shadow-sm"
                  : "text-indigo-100/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-xl border border-white/15 bg-white/10 p-3 text-xs text-indigo-100/85">
        Tips: 先上传资料，再从结果页进入闪卡和总结，体验会更连贯。
      </div>
    </aside>
  );
}
