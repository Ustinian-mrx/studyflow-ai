import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  openai,
  TONGYI_DOC_MODEL,
  TONGYI_VISION_MODEL,
} from "@/lib/openai";

type AIFlashcard = {
  question: string;
  answer: string;
  tags?: string[];
};

type AIAnalysisResult = {
  summary: string;
  keyPoints: string[];
  difficulties: string[];
  suggestions: string[];
  tags: string[];
  flashcards: AIFlashcard[];
};

function createFallbackAnalysis(
  filename: string,
  fileType: string | null
): AIAnalysisResult {
  const materialType =
    fileType === "application/pdf" ? "PDF 文档" : "图片资料";

  return {
    summary: `当前百炼服务暂时不可用，系统已为《${filename}》生成一份本地兜底分析结果。该资料被识别为${materialType}，可继续用于结果页、闪卡和总结页联调。`,
    keyPoints: [
      `已成功接收并识别《${filename}》`,
      `当前资料类型为${materialType}`,
      "上传、解析、落库与页面展示链路可继续验证",
    ],
    difficulties: [
      "当前外部 AI 服务账号状态异常，真实模型分析被拦截",
      "该结果为本地兜底数据，不代表真实模型输出质量",
    ],
    suggestions: [
      "先继续验证上传、结果、闪卡、总结等页面流程",
      "恢复百炼账号状态后再切回真实 AI 结果联调",
      "后续可保留该兜底逻辑，避免外部服务异常时整条链路中断",
    ],
    tags: ["兜底分析", materialType, "联调测试"],
    flashcards: [
      {
        question: "当前资料的处理状态是什么？",
        answer: "资料已完成本地兜底分析，可继续验证后续页面与数据库链路。",
        tags: ["流程状态"],
      },
      {
        question: "为什么当前结果不是完全真实的 AI 输出？",
        answer: "因为外部百炼服务当前返回账号状态拦截，系统自动切换到了本地兜底分析。",
        tags: ["异常说明"],
      },
      {
        question: "当前最适合继续验证什么？",
        answer: "适合继续验证结果页、闪卡页、总结页、历史记录和重试流程是否正常。",
        tags: ["联调建议"],
      },
      {
        question: "恢复真实 AI 分析前需要做什么？",
        answer: "需要先恢复百炼账号状态，确保模型接口可以正常调用。",
        tags: ["恢复条件"],
      },
      {
        question: "当前这份资料是什么类型？",
        answer: `这份资料被识别为${materialType}。`,
        tags: ["资料类型"],
      },
    ],
  };
}

function shouldFallbackToLocalAnalysis(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error ?? "");

  return (
    message.includes("Access denied") ||
    message.includes("good standing") ||
    message.includes("overdue-payment") ||
    message.includes("insufficient_quota")
  );
}

function getSingleSummaryTitle(filename: string) {
  return `${filename} — 单篇总结`;
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function normalizeFlashcards(value: unknown): AIFlashcard[] {
  if (!Array.isArray(value)) return [];

  const items = value
    .map((item): AIFlashcard | null => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const question =
        typeof record.question === "string" ? record.question.trim() : "";
      const answer =
        typeof record.answer === "string" ? record.answer.trim() : "";
      const tags = normalizeStringArray(record.tags);

      if (!question || !answer) return null;

      return {
        question,
        answer,
        tags,
      };
    })
    .filter((item): item is AIFlashcard => item !== null);

  return items;
}

function extractJsonText(raw: string) {
  const trimmed = raw.trim();

  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "");
    return withoutFence.trim();
  }

  return trimmed;
}

function parseModelJson(text: string): AIAnalysisResult {
  const parsed = JSON.parse(extractJsonText(text)) as Record<string, unknown>;

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
    keyPoints: normalizeStringArray(parsed.keyPoints),
    difficulties: normalizeStringArray(parsed.difficulties),
    suggestions: normalizeStringArray(parsed.suggestions),
    tags: normalizeStringArray(parsed.tags),
    flashcards: normalizeFlashcards(parsed.flashcards),
  };
}

function buildAnalysisPrompt(filename: string) {
  return `请分析这份学习资料《${filename}》，并只返回严格 JSON，不要输出 markdown、解释或额外文字。

JSON 结构如下：
{
  "summary": "一段简明摘要",
  "keyPoints": ["3到8条核心知识点"],
  "difficulties": ["1到5条疑难点或易错点"],
  "suggestions": ["2到5条学习建议"],
  "tags": ["3到6个标签"],
  "flashcards": [
    {
      "question": "闪卡问题",
      "answer": "闪卡答案",
      "tags": ["标签"]
    }
  ]
}

要求：
1. 输出必须是合法 JSON
2. 内容使用简体中文
3. flashcards 生成 5 到 10 张
4. 面向学习复习场景，突出知识点、难点和复习建议`;
}

async function analyzeImageWithTongyi(
  absoluteFilePath: string,
  filename: string
): Promise<AIAnalysisResult> {
  const file = await fs.readFile(absoluteFilePath);
  const base64 = file.toString("base64");
  const ext = path.extname(filename).toLowerCase();

  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";

  const completion = await openai.chat.completions.create({
    model: TONGYI_VISION_MODEL,
    messages: [
      {
        role: "system",
        content:
          "你是学习资料分析助手。你必须只输出合法 JSON，不要输出 markdown、解释或额外文字。",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: buildAnalysisPrompt(filename),
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
  });

  const text = completion.choices[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("通义千问未返回有效内容");
  }

  return parseModelJson(text);
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function analyzeDocumentWithTongyi(
  absoluteFilePath: string,
  filename: string,
  mimeType: string
): Promise<AIAnalysisResult> {
  const buffer = await fs.readFile(absoluteFilePath);

    const fileObject = await openai.files.create({
    file: new File([buffer], filename, { type: mimeType }),
    purpose: "file-extract" as never,
  });


  let lastError: unknown = null;

  for (let i = 0; i < 8; i += 1) {
    try {
      const completion = await openai.chat.completions.create({
        model: TONGYI_DOC_MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是学习资料分析助手。你必须只输出合法 JSON，不要输出 markdown、解释或额外文字。",
          },
          {
            role: "system",
            content: `fileid://${fileObject.id}`,
          },
          {
            role: "user",
            content: buildAnalysisPrompt(filename),
          },
        ],
        temperature: 0.2,
      });

      const text = completion.choices[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("通义千问未返回有效内容");
      }

      return parseModelJson(text);
    } catch (error) {
      lastError = error;
      const message =
        error instanceof Error ? error.message : String(error);

      if (!message.includes("File parsing in progress")) {
        throw error;
      }

      await wait(2000);
    }
  }

  throw new Error(
    lastError instanceof Error
      ? lastError.message
      : "文档解析超时，请稍后重试"
  );
}

async function analyzeFile(
  absoluteFilePath: string,
  filename: string,
  fileType: string | null
) {
  if (
    fileType === "image/png" ||
    fileType === "image/jpeg" ||
    fileType === "image/jpg" ||
    fileType === "image/webp"
  ) {
    return analyzeImageWithTongyi(absoluteFilePath, filename);
  }

  if (fileType === "application/pdf") {
    return analyzeDocumentWithTongyi(
      absoluteFilePath,
      filename,
      "application/pdf"
    );
  }

  throw new Error("当前仅支持 PDF、PNG、JPG、JPEG、WEBP 文件分析");
}

export async function processDocumentAnalysis(documentId: number) {
  try {
    console.log("[analysis] 开始处理文档:", documentId);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "extracting",
        errorMessage: null,
      },
    });

    console.log("[analysis] 状态 -> extracting");

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error("文档不存在");
    }

    const absoluteFilePath = path.join(
      process.cwd(),
      "public",
      document.fileUrl.replace(/^\/+/, "")
    );

    console.log("[analysis] 文档信息:", {
      id: document.id,
      filename: document.filename,
      fileType: document.fileType,
      fileUrl: document.fileUrl,
    });

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "analyzing",
      },
    });

    console.log("[analysis] 状态 -> analyzing");

    let aiResult: AIAnalysisResult;

    try {
      console.log("[analysis] 开始调用模型分析");
      aiResult = await analyzeFile(
        absoluteFilePath,
        document.filename,
        document.fileType
      );
      console.log("[analysis] 模型分析完成");
    } catch (error) {
      if (!shouldFallbackToLocalAnalysis(error)) {
        throw error;
      }

      console.warn(
        "[analysis] 外部 AI 服务不可用，切换到本地兜底分析:",
        error
      );

      aiResult = createFallbackAnalysis(document.filename, document.fileType);
    }

    const summaryTitle = getSingleSummaryTitle(document.filename);
    const today = new Date().toISOString().slice(0, 10);

    console.log("[analysis] 写入 AnalysisResult");
    await prisma.analysisResult.upsert({
      where: { documentId },
      update: {
        summary: aiResult.summary,
        keyPoints: aiResult.keyPoints,
        difficulties: aiResult.difficulties,
        suggestions: aiResult.suggestions,
        tags: aiResult.tags,
      },
      create: {
        documentId,
        summary: aiResult.summary,
        keyPoints: aiResult.keyPoints,
        difficulties: aiResult.difficulties,
        suggestions: aiResult.suggestions,
        tags: aiResult.tags,
      },
    });

    await prisma.flashcard.deleteMany({
      where: { documentId },
    });

    if (aiResult.flashcards.length > 0) {
      console.log("[analysis] 写入 Flashcard");
      await prisma.flashcard.createMany({
        data: aiResult.flashcards.map((card) => ({
          documentId,
          question: card.question,
          answer: card.answer,
          tags: card.tags ?? [],
        })),
      });
    }

    const existingSummary = await prisma.summary.findFirst({
      where: {
        userId: document.userId,
        documentId,
        type: "single",
      },
    });

    if (existingSummary) {
      console.log("[analysis] 更新 Summary");
      await prisma.summary.update({
        where: { id: existingSummary.id },
        data: {
          title: summaryTitle,
          period: today,
          content: aiResult.summary,
          keyPoints: aiResult.keyPoints,
          suggestions: aiResult.suggestions,
        },
      });
    } else {
      console.log("[analysis] 新建 Summary");
      await prisma.summary.create({
        data: {
          userId: document.userId,
          documentId,
          type: "single",
          title: summaryTitle,
          period: today,
          content: aiResult.summary,
          keyPoints: aiResult.keyPoints,
          suggestions: aiResult.suggestions,
        },
      });
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "done",
        errorMessage: null,
      },
    });

    console.log("[analysis] 状态 -> done");
  } catch (error) {
    console.error("[analysis] 处理失败:", error);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "failed",
        errorMessage: (error as Error).message || "分析失败",
      },
    });
  }
}
