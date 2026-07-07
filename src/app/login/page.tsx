"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");

        if (!email.trim()) {
            setError("请输入邮箱");
            return;
        }

        if (!password.trim()) {
            setError("请输入密码");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "登录失败");
                return;
            }

            if (!data.token) {
                setError("登录成功但未收到 token");
                return;
            }

            // 兼容现有客户端鉴权逻辑，写入本地后再跳转控制台。
            setToken(data.token);
            router.push("/dashboard");
        } catch {
            setError("网络异常，请稍后重试");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-sky-50 to-emerald-100" />
            <div className="absolute -left-24 -top-24 -z-10 h-64 w-64 rounded-full bg-indigo-300/35 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />

            <div className="w-full max-w-sm rounded-2xl border border-white/70 bg-white/88 p-6 shadow-xl backdrop-blur">
                <div className="mb-5">
                    <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        StudyFlow AI
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">登录</h1>
                    <p className="mt-2 text-sm text-slate-500">欢迎回来，继续你的学习流程。</p>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm">邮箱</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                            placeholder="请输入邮箱"
                        />
                    </div>

                    <div>
                        <label className="text-sm">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                            placeholder="请输入密码"
                        />
                    </div>

                    {error ? <div className="text-sm text-red-500">{error}</div> : null}

                    <Button className="w-full" onClick={handleLogin} disabled={loading}>
                        {loading ? "登录中..." : "登录"}
                    </Button>
                </div>

                <div className="mt-4 text-sm text-slate-500">
                    还没有账号？
                    <Link className="ml-1 text-slate-900 underline" href="/register">去注册</Link>
                </div>
            </div>
        </div>
    );
}
