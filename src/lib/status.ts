export type StatusKey = "uploading" | "extracting" | "analyzing" | "done" | "failed";

// 状态文案映射：前后端展示统一走这里，避免硬编码分散。
export const statusLabel: Record<StatusKey, string> = {
  uploading: "上传中",
  extracting: "文本提取中",
  analyzing: "分析中",
  done: "已完成",
  failed: "失败",
};

// 状态颜色映射：与状态文案一一对应。
export const statusColor: Record<StatusKey, string> = {
  uploading: "bg-sky-100 text-sky-700",
  extracting: "bg-amber-100 text-amber-700",
  analyzing: "bg-indigo-100 text-indigo-700",
  done: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};
