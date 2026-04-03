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
    <aside className="h-screen w-60 border-r bg-white px-4 py-6">
      <div className="mb-6 text-xl font-semibold">StudyFlow AI</div>
      <nav className="space-y-2 text-sm">
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
              className={`block rounded px-3 py-2 ${
                active ? "bg-slate-100 font-medium" : "hover:bg-slate-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
