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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function getDashboardData() {
  return {
    quick: dashboardQuick,
    recentUploads: dashboardRecentUploads,
    recentOutputs: dashboardRecentOutputs,
  };
}

export async function getHistoryList() {
  const res = await fetch(`${BASE_URL}/api/history`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return historyList;
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
      ...flashcardsData,
      id: Number(id) || flashcardsData.id,
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
      ...summaryData,
      id: Number(id) || summaryData.id,
    };
  }

  return res.json();
}

export async function getProfileData() {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    cache: "no-store",
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
