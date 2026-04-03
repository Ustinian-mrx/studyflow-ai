import type { ProcessingStep } from "./types";

// 分析进度阶段定义：接口失败时可作为展示兜底，不影响流程演示。
export const processingSteps: ProcessingStep[] = [
  { key: "uploading", label: "上传中" },
  { key: "extracting", label: "文本提取中" },
  { key: "analyzing", label: "分析中" },
  { key: "done", label: "已完成" },
];
