"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  summaryHref?: string;
};

export default function Sidebar({
  summaryHref = "/history",
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "首页", href: "/dashboard" },
    { name: "上传", href: "/upload" },
    { name: "历史记录", href: "/history" },
    { name: "总结", href: summaryHref },
    { name: "个人中心", href: "/profile" },
  ];

  return (
    <aside className="h-screen w-60 border-r bg-white px-4 py-6">
      <div className="mb-6 text-xl font-semibold">StudyFlow AI</div>

      <nav className="space-y-2 text-sm">
        {navItems.map((item) => {
          const active =
            item.name === "总结"
              ? pathname.startsWith("/summary")
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
