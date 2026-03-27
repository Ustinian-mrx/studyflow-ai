import type { StatusKey } from "@/lib/status";

export type UploadStatus = StatusKey;

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

export type UploadOption = {
  subject: string;
  level: string;
  goal: string;
};

export type HistoryItem = {
  id: number;
  name: string;
  time: string;
  status: StatusKey;
};

export type DashboardQuickItem = {
  title: string;
  href: string;
  description?: string;
};

export type DashboardRecentUploadItem = HistoryItem;

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

export type WeeklySummaryListItem = {
  id: number;
  title: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
};

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
