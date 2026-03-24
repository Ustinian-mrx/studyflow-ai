import { cookies } from "next/headers";
import {
  dashboardQuick,
  dashboardRecentUploads,
  dashboardRecentOutputs,
  processingSteps,
  uploadOption,
  flashcardsData,
  summaryData,
  profileData,
  historyList,
} from "./mock";
import type {
  DashboardData,
  FlashcardsData,
  HistoryItem,
  ProfileData,
  ResultData,
  SummaryData,
} from "./types";
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
  const res = await fetch(`${BASE_URL}/api/dashboard`, {
    cache: "no-store",
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
  const res = await fetch(`${BASE_URL}/api/history`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function getResultData(id: string) {
  const res = await fetch(`${BASE_URL}/api/result/${id}`, {
    cache: "no-store",
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
  const res = await fetch(`${BASE_URL}/api/flashcards/${id}`, {
    cache: "no-store",
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
  const res = await fetch(`${BASE_URL}/api/summary/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      id: Number(id) || 0,
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
    return profileData;
  }

  const res = await fetch(`${BASE_URL}/api/profile`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    return profileData;
  }

  return res.json();
}

export async function getProcessingSteps() {
  return processingSteps;
}

export async function getUploadOption() {
  return uploadOption;
}
