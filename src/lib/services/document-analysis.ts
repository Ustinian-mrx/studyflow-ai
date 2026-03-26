import { prisma } from "@/lib/prisma";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSingleSummaryTitle(filename: string) {
  return `${filename} — 单篇总结`;
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

    await sleep(1500);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "analyzing",
      },
    });

    await sleep(2000);

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error("文档不存在");
    }

    const fakeSummary = `这是对《${document.filename}》的自动分析摘要。主要内容已经被提炼为知识点、疑难点和学习建议。`;

    const fakeKeyPoints = [
      "核心概念梳理",
      "重点知识归纳",
      "常见题型总结",
    ];

    const fakeDifficulties = [
      "抽象概念理解较难",
      "公式应用容易混淆",
    ];

    const fakeSuggestions = [
      "建议先复习基础定义",
      "建议配合典型例题练习",
      "建议整理错题再次回顾",
    ];

    const fakeTags = ["学习资料", "自动分析", "MVP"];
    const summaryTitle = getSingleSummaryTitle(document.filename);
    const today = new Date().toISOString().slice(0, 10);

    await prisma.analysisResult.upsert({
      where: { documentId },
      update: {
        summary: fakeSummary,
        keyPoints: fakeKeyPoints,
        difficulties: fakeDifficulties,
        suggestions: fakeSuggestions,
        tags: fakeTags,
      },
      create: {
        documentId,
        summary: fakeSummary,
        keyPoints: fakeKeyPoints,
        difficulties: fakeDifficulties,
        suggestions: fakeSuggestions,
        tags: fakeTags,
      },
    });

    await prisma.flashcard.deleteMany({
      where: { documentId },
    });

    await prisma.flashcard.createMany({
      data: [
        {
          documentId,
          question: "这份资料的核心内容是什么？",
          answer: "核心内容已经被系统提炼为摘要和知识点。",
          tags: ["概览"],
        },
        {
          documentId,
          question: "复习时应该优先关注什么？",
          answer: "建议优先关注基础定义、重点知识和典型题型。",
          tags: ["复习建议"],
        },
        {
          documentId,
          question: "这份资料有哪些可能的难点？",
          answer: "抽象概念理解和公式应用是两个常见难点。",
          tags: ["疑难点"],
        },
      ],
    });

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
          content: fakeSummary,
          keyPoints: fakeKeyPoints,
          suggestions: fakeSuggestions,
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
          content: fakeSummary,
          keyPoints: fakeKeyPoints,
          suggestions: fakeSuggestions,
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
