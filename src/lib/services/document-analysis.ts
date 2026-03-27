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
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "extracting",
        errorMessage: null,
      },
    });

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

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "analyzing",
      },
    });

    const aiResult = await analyzeFile(
      absoluteFilePath,
      document.filename,
      document.fileType
    );

    const summaryTitle = getSingleSummaryTitle(document.filename);
    const today = new Date().toISOString().slice(0, 10);

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
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "failed",
        errorMessage: (error as Error).message || "分析失败",
      },
    });
  }
}
