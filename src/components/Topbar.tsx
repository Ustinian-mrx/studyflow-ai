"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/dashboard": "控制台",
  "/upload": "上传资料",
  "/history": "历史记录",
  "/profile": "个人中心",
};

export default function Topbar() {
  const pathname = usePathname();

  const title =
    titleMap[pathname] ||
    (pathname.startsWith("/result") ? "分析结果" : "") ||
    (pathname.startsWith("/flashcards") ? "闪卡" : "") ||
    (pathname.startsWith("/summary") ? "总结" : "") ||
    "StudyFlow AI";

  const handleLogout = () => {
    alert("已点击退出（占位），后续接入真实登录逻辑");
  };

  return (
    <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
      <div className="text-sm text-slate-500">{title}</div>

      <div className="relative group">
        <button className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">
            夏
          </span>
          <span>用户名</span>
          <span className="text-slate-400">▼</span>
        </button>

        <div className="absolute right-0 mt-2 hidden w-36 rounded-md border bg-white shadow-sm group-hover:block">
          <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-slate-50">
            个人中心
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
          >
            退出登录
          </button>
        </div>
      </div>
    </header>
  );
}
