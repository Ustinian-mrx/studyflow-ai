import { cookies } from "next/headers";
import { processingSteps } from "./mock";
import type { ProfileData } from "./types";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboardData() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}/api/dashboard`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return {
      quick: [
        { title: "上传资料", href: "/upload" },
        { title: "查看历史", href: "/history" },
      ],
      recentUploads: [],
      recentOutputs: [],
    };
  }

  return res.json();
}

export async function getHistoryList() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}/api/history`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function getResultData(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}/api/result/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();

    return {
      id: Number(id) || 0,
      filename: "未知文件",
      uploadedAt: "",
      status: "failed",
      summary: "",
      keyPoints: [],
      difficulties: [],
      suggestions: [],
      tags: [],
      errorMessage: `接口错误 ${res.status}: ${text}`,
    };
  }

  return res.json();
}

export async function getFlashcardsData(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}/api/flashcards/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return {
      id: Number(id) || 0,
      documentName: "未知文档",
      total: 0,
      categories: 0,
      tags: [],
      items: [],
    };
  }

  return res.json();
}

export async function getSummaryData(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}/api/summary/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return {
      documentId: Number(id) || 0,
      summaryId: null,
      documentName: "未知文档",
      type: "single",
      title: "暂无总结",
      period: "",
      content: "",
      keyPoints: [],
      suggestions: [],
      generatedAt: "",
    };
  }

  return res.json();
}


export async function getProfileData(): Promise<ProfileData> {
  const headers = await getAuthHeaders();

  if (!headers) {
    return {
      name: "未登录用户",
      email: "",
      role: "游客",
      tags: ["暂未生成学习标签"],
      stats: {
        documents: 0,
        flashcards: 0,
        summaries: 0,
      },
    };
  }

  const res = await fetch(`${BASE_URL}/api/profile`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return {
      name: "未登录用户",
      email: "",
      role: "游客",
      tags: ["暂未生成学习标签"],
      stats: {
        documents: 0,
        flashcards: 0,
        summaries: 0,
      },
    };
  }

  return res.json();
}

export async function getProcessingSteps() {
  return processingSteps;
}
