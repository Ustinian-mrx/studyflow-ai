export type StatusKey = "uploading" | "extracting" | "analyzing" | "done" | "failed";

export const statusLabel: Record<StatusKey, string> = {
  uploading: "上传中",
  extracting: "文本提取中",
  analyzing: "分析中",
  done: "已完成",
  failed: "失败",
};

export const statusColor: Record<StatusKey, string> = {
  uploading: "bg-blue-100 text-blue-700",
  extracting: "bg-amber-100 text-amber-700",
  analyzing: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};
