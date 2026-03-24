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
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div className="text-lg font-semibold text-slate-900">StudyFlow AI</div>

      <div className="relative" ref={menuRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen((prev) => !prev)}
        >
          {userName}
        </Button>

        {open ? (
          <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg z-50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              个人中心
            </Link>

            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              onClick={handleLogout}
            >
              退出登录
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}