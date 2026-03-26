import type {
  DashboardData,
  FlashcardsData,
  HistoryItem,
  ProcessingStep,
  ProfileData,
  ResultData,
  SummaryData,
  UploadOption,
} from "./types";

export const dashboardQuick: DashboardData["quick"] = [
  { title: "上传资料", href: "/upload" },
  { title: "查看历史", href: "/history" },
  { title: "本周总结", href: "/history" },
  { title: "闪卡复习", href: "/history" },

];

export const historyList: HistoryItem[] = [
  { id: 1, name: "高数极限.pdf", time: "2026-03-10 19:20", status: "done" },
  { id: 2, name: "英语阅读.pdf", time: "2026-03-09 21:10", status: "analyzing" },
  { id: 3, name: "线代笔记.jpg", time: "2026-03-08 17:30", status: "failed" },
];

export const flashcardsData: FlashcardsData = {
  id: 1,
  documentName: "高数极限.pdf",
  total: 24,
  categories: 3,
  tags: ["极限", "导数", "积分"],
  items: [
    {
      id: 1,
      question: "什么是极限？",
      answer: "描述函数在某点附近的变化趋势。",
      tags: ["概念"],
    },
    {
      id: 2,
      question: "导数的几何意义是什么？",
      answer: "曲线在该点的切线斜率。",
      tags: ["概念"],
    },
    {
      id: 3,
      question: "积分的直观意义？",
      answer: "面积或累积量的总和。",
      tags: ["应用"],
    },
  ],
};

export const uploadOption: UploadOption = {
  subject: "高等数学",
  level: "大一",
  goal: "考试复习",
};

export const processingSteps: ProcessingStep[] = [
  { key: "uploading", label: "上传中" },
  { key: "extracting", label: "文本提取中" },
  { key: "analyzing", label: "分析中" },
  { key: "done", label: "已完成" },
];

export const resultData: ResultData = {
  id: 1,
  filename: "高数极限.pdf",
  uploadedAt: "2026-03-10 19:20",
  status: "done",
  summary: "这是对极限概念的简要总结（占位）。",
  keyPoints: ["极限定义", "左右极限", "无穷大与无穷小"],
  difficulties: ["ε-δ 定义理解", "极限证明步骤"],
  suggestions: ["先掌握定义", "多做典型题"],
  tags: ["高数", "极限", "复习"],
  errorMessage: "解析失败，请稍后重试。",
};

export const summaryData: SummaryData = {
  id: 1,
  type: "single",
  title: "高数极限 — 单篇总结",
  period: "2026-03-10",
  content: "这是单篇总结内容（占位）。",
  keyPoints: ["极限概念", "左右极限", "常见题型"],
  suggestions: ["按章节复习", "整理错题"],
  generatedAt: "2026-03-10 20:10",
};

export const profileData: ProfileData = {
  name: "小明",
  email: "user@example.com",
  role: "大学生",
  tags: ["高数", "英语", "线性代数"],
  stats: {
    documents: 12,
    flashcards: 86,
    summaries: 7,
  },
};

export const dashboardRecentUploads: DashboardData["recentUploads"] = [
  { id: 1, name: "高数极限.pdf", time: "2026-03-10 19:20", status: "done" },
  { id: 2, name: "英语阅读.pdf", time: "2026-03-09 21:10", status: "analyzing" },
];

export const dashboardRecentOutputs: DashboardData["recentOutputs"] = [
  { id: 1, title: "本周闪卡", value: "24 张", desc: "来自 3 份资料" },
  { id: 2, title: "本周总结", value: "1 篇", desc: "最近生成于 20:10" },
];
