"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "首页", href: "/dashboard" },
  { name: "上传", href: "/upload" },
  { name: "历史记录", href: "/history" },
  { name: "总结", href: "/summary/1" },
  { name: "个人中心", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-60 border-r bg-white px-4 py-6">
      <div className="mb-6 text-xl font-semibold">StudyFlow AI</div>
      <nav className="space-y-2 text-sm">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href.replace("/1", ""));
          return (
            <Link
              key={item.href}
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