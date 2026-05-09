import type { StatusKey } from "@/lib/status";

export type UploadStatus = StatusKey;

// 单文档分析结果：对应 /result/[documentId] 页面所需字段。
export type ResultData = {
  id: number;
  filename: string;
  uploadedAt: string;
  status: UploadStatus;
  summary: string;
  keyPoints: string[];
  difficulties: string[];
  suggestions: string[];
  tags: string[];
  errorMessage?: string;
};

// 上传入口附加参数：供前端表单与后端扩展字段共用。
export type UploadOption = {
  subject: string;
  level: string;
  goal: string;
};

// 历史记录的轻量列表项。
export type HistoryItem = {
  id: number;
  name: string;
  time: string;
  status: StatusKey;
};

// 首页快捷入口配置。
export type DashboardQuickItem = {
  title: string;
  href: string;
  description?: string;
};

export type DashboardRecentUploadItem = HistoryItem;

// 首页最近产出卡片。
export type DashboardRecentOutputItem = {
  id: number;
  title: string;
  value: string;
  desc: string;
};

export type DashboardData = {
  isAuthenticated: boolean;
  quick: DashboardQuickItem[];
  recentUploads: DashboardRecentUploadItem[];
  recentOutputs: DashboardRecentOutputItem[];
};

// 闪卡明细。
export type FlashcardItem = {
  id: number;
  question: string;
  answer: string;
  tags?: string[];
};

export type FlashcardsData = {
  id: number;
  documentName: string;
  total: number;
  categories: number;
  tags: string[];
  items: FlashcardItem[];
};

// 总结详情：兼容单篇总结与周总结两种类型。
export type SummaryData = {
  documentId: number;
  summaryId: number | null;
  documentName: string;
  type: "single" | "weekly";
  title: string;
  period: string;
  content: string;
  keyPoints: string[];
  suggestions: string[];
  generatedAt: string;
};

// 个人页数据结构。
export type ProfileData = {
  isAuthenticated: boolean;
  name: string;
  email: string;
  role: string;
  tags: string[];
  stats: {
    documents: number;
    flashcards: number;
    summaries: number;
  };
};

export type ProcessingStep = {
  key: StatusKey;
  label: string;
};

// 周总结列表项（用于 /summaries 页面）。
export type WeeklySummaryListItem = {
  id: number;
  title: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
};

// 周总结详情（用于 /summaries/weekly/[id] 页面）。
export type WeeklySummaryDetail = {
  id: number;
  type: "weekly";
  title: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  content: string;
  keyPoints: string[];
  suggestions: string[];
  createdAt: string;
};
