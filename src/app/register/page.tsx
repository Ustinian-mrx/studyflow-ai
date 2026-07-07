"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("学生");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(e?: React.FormEvent) {
        e?.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("请输入邮箱");
            return;
        }

        if (!password.trim()) {
            setError("请输入密码");
            return;
        }

        if (password !== confirmPassword) {
            setError("两次输入的密码不一致");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    name: name.trim() || "未命名用户",
                    role: role.trim() || "学生",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "注册失败");
                return;
            }

            // 注册成功后短暂停留提示，再跳登录页继续流程。
            setSuccess("注册成功，正在跳转到登录页...");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch {
            setError("网络异常，请稍后重试");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-100" />
            <div className="absolute -left-24 -top-24 -z-10 h-64 w-64 rounded-full bg-sky-300/35 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />

            <div className="w-full max-w-sm rounded-2xl border border-white/70 bg-white/88 p-6 shadow-xl backdrop-blur">
                <div className="mb-5">
                    <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                        StudyFlow AI
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">注册</h1>
                    <p className="mt-2 text-sm text-slate-500">创建新账号，开始 AI 学习整理。</p>
                </div>

                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm">姓名</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            placeholder="请输入姓名"
                        />
                    </div>

                    <div>
                        <label className="text-sm">邮箱</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            placeholder="请输入邮箱"
                        />
                    </div>

                    <div>
                        <label className="text-sm">角色</label>
                        <input
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            placeholder="请输入角色，如：学生"
                        />
                    </div>

                    <div>
                        <label className="text-sm">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            placeholder="请输入密码"
                        />
                    </div>

                    <div>
                        <label className="text-sm">确认密码</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            placeholder="请再次输入密码"
                        />
                    </div>

                    {error ? <div className="text-sm text-red-500">{error}</div> : null}
                    {success ? (
                        <div className="text-sm text-emerald-600">{success}</div>
                    ) : null}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "注册中..." : "注册"}
                    </Button>
                </form>

                <div className="mt-4 text-sm text-slate-500">
                    已有账号？
                    <Link className="ml-1 text-slate-900 underline" href="/login">去登录</Link>
                </div>
            </div>
        </div>
    );
}
