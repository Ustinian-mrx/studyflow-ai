"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">登录</h1>
                <p className="mt-2 text-sm text-slate-500">欢迎回来，继续学习。</p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm">邮箱</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="请输入邮箱"
                        />
                    </div>

                    <div>
                        <label className="text-sm">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
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
                    <a className="ml-1 text-slate-900 underline" href="/register">
                        去注册
                    </a>
                </div>
            </div>
        </div>
    );
}
