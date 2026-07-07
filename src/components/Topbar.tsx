"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/lib/auth";

type TopbarProps = {
  userName?: string;
};

export default function Topbar({ userName = "用户" }: TopbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // 即使接口失败，也继续清本地并跳转
    }

    removeToken();
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      // 点击菜单外区域时收起下拉，避免悬浮菜单残留。
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div>
          <div className="text-lg font-semibold tracking-tight text-slate-900">
            StudyFlow AI
          </div>
          <div className="text-xs text-slate-500">学习资料分析与复习工作台</div>
        </div>

        <div className="relative" ref={menuRef}>
          <Button
            type="button"
            variant="outline"
            className="rounded-full bg-white/90"
            onClick={() => setOpen((prev) => !prev)}
          >
            {userName}
          </Button>

          {open ? (
            <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <Link
                href="/profile"
                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                个人中心
              </Link>

              <button
                type="button"
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header >
  );
}
