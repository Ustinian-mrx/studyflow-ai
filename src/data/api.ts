import { cookies } from "next/headers";
import { processingSteps } from "./mock";
import type {
  DashboardData,
  ProfileData,
  SummaryData,
  WeeklySummaryDetail,
  WeeklySummaryListItem,
} from "./types";
import { AUTH_COOKIE_NAME } from "@/lib/constants";



const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function createGuestDashboardData(): DashboardData {
  return {
    isAuthenticated: false,
    quick: [],
    recentUploads: [],
    recentOutputs: [],
  };
}

function createGuestProfileData(): ProfileData {
  return {
    isAuthenticated: false,
    name: "未登录用户",
    email: "",
    role: "游客",
    tags: [],
    stats: {
      documents: 0,
      flashcards: 0,
      summaries: 0,
    },
  };
}

function createEmptySummaryData(id: string): SummaryData {
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

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return undefined;
  }

  return {
    // 服务端组件请求内部 API 时，向后透传登录态。
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const headers = await getAuthHeaders();

  if (!headers) {
    // 返回游客态固定结构，避免页面因为字段缺失报错。
    return createGuestDashboardData();
  }

  const res = await fetch(`${BASE_URL}/api/dashboard`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return createGuestDashboardData();
  }

  const data = (await res.json()) as Omit<DashboardData, "isAuthenticated">;

  return {
    isAuthenticated: true,
    quick: data.quick ?? [],
    recentUploads: data.recentUploads ?? [],
    recentOutputs: data.recentOutputs ?? [],
  };
}

export async function getHistoryList() {
  const headers = await getAuthHeaders();

  if (!headers) {
    return [];
  }

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

  if (!headers) {
    return {
      id: Number(id) || 0,
      filename: "未登录",
      uploadedAt: "",
      status: "failed",
      summary: "",
      keyPoints: [],
      difficulties: [],
      suggestions: [],
      tags: [],
      errorMessage: "请先登录后再查看分析结果。",
    };
  }

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

  if (!headers) {
    return {
      id: Number(id) || 0,
      documentName: "未登录用户",
      total: 0,
      categories: 0,
      tags: [],
      items: [],
    };
  }

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

export async function getSummaryData(id: string): Promise<SummaryData> {
  const headers = await getAuthHeaders();

  if (!headers) {
    return createEmptySummaryData(id);
  }

  const res = await fetch(`${BASE_URL}/api/summary/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return createEmptySummaryData(id);
  }

  return res.json();
}

export async function getProfileData(): Promise<ProfileData> {
  const headers = await getAuthHeaders();

  if (!headers) {
    return createGuestProfileData();
  }

  const res = await fetch(`${BASE_URL}/api/profile`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return createGuestProfileData();
  }

  const data = (await res.json()) as Omit<ProfileData, "isAuthenticated">;

  return {
    isAuthenticated: true,
    name: data.name,
    email: data.email,
    role: data.role,
    tags: data.tags ?? [],
    stats: data.stats,
  };
}

export async function getProcessingSteps() {
  return processingSteps;
}

export async function getWeeklySummaries(): Promise<WeeklySummaryListItem[]> {
  const headers = await getAuthHeaders();

  if (!headers) {
    return [];
  }

  const res = await fetch(`${BASE_URL}/api/summaries/weekly`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function getWeeklySummaryDetail(
  id: string
): Promise<WeeklySummaryDetail | null> {
  const headers = await getAuthHeaders();

  if (!headers) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/api/summaries/weekly/${id}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
