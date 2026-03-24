"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

async function handleRegister() {
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
<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
<div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
<h1 className="text-2xl font-semibold">注册</h1>
<p className="mt-2 text-sm text-slate-500">创建新账号开始使用。</p>

<div className="mt-6 space-y-4">
<div>
<label className="text-sm">姓名</label>
<input
value={name}
onChange={(e) => setName(e.target.value)}
className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
placeholder="请输入姓名"
/>
</div>

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
<label className="text-sm">角色</label>
<input
value={role}
onChange={(e) => setRole(e.target.value)}
className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
placeholder="请输入角色，如：学生"
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

<div>
<label className="text-sm">确认密码</label>
<input
type="password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
placeholder="请再次输入密码"
/>
</div>

{error ? <div className="text-sm text-red-500">{error}</div> : null}
{success ? (
<div className="text-sm text-emerald-600">{success}</div>
) : null}

<Button className="w-full" onClick={handleRegister} disabled={loading}>
{loading ? "注册中..." : "注册"}
</Button>
</div>

<div className="mt-4 text-sm text-slate-500">
已有账号？
<a className="ml-1 text-slate-900 underline" href="/login">
去登录
</a>
</div>
</div>
</div>
);
}