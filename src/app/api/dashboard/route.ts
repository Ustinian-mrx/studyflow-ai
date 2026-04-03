import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { uploadedAt: "desc" },
      take: 5,
      select: {
        id: true,
        filename: true,
        uploadedAt: true,
        status: true,
      },
    });

    const latestFlashcardDocument = await prisma.document.findFirst({
      where: {
        userId: user.id,
        flashcards: {
          some: {},
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
      select: {
        id: true,
      },
    });

    // 单篇总结入口按文档维度跳转到 /summary/[documentId]。
    const latestSingleSummary = await prisma.summary.findFirst({
      where: {
        userId: user.id,
        type: "single",
        documentId: { not: null },
      },
      orderBy: { createdAt: "desc" },
      select: { documentId: true },
    });

    // 周总结使用独立的 summaryId，并走 /summaries/weekly/[id] 路由。
    const latestWeeklySummary = await prisma.summary.findFirst({
      where: {
        userId: user.id,
        type: "weekly",
      },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    const flashcardsCount = await prisma.flashcard.count({
      where: {
        document: {
          userId: user.id,
        },
      },
    });

    const summariesCount = await prisma.summary.count({
      where: { userId: user.id },
    });

    const doneCount = await prisma.document.count({
      where: {
        userId: user.id,
        status: "done",
      },
    });

    return NextResponse.json({
      quick: [
        {
          title: "上传资料",
          href: "/upload",
          description: "添加新的学习资料并开始分析",
        },
        {
          title: "查看历史",
          href: "/history",
          description: "回看已上传文档和分析结果",
        },
        {
          title: "闪卡复习",
          href: latestFlashcardDocument?.id
            ? `/flashcards/${latestFlashcardDocument.id}`
            : "/history",
          description: "进入最近一份资料的闪卡复习",
        },
        {
          title: "单篇总结",
          href: latestSingleSummary?.documentId
            ? `/summary/${latestSingleSummary.documentId}`
            : "/history",
          description: "查看最近一份文档的总结",
        },
        {
          title: "周总结",
          href: latestWeeklySummary?.id
            ? `/summaries/weekly/${latestWeeklySummary.id}`
            : "/summaries",
          description: "查看本周学习复盘",
        },
      ],

      recentUploads: documents.map((item) => ({
        id: item.id,
        name: item.filename,
        time: item.uploadedAt.toISOString().slice(0, 16).replace("T", " "),
        status: item.status,
      })),
      recentOutputs: [
        {
          id: 1,
          title: "已完成分析",
          value: String(doneCount),
          desc: "已生成完整分析结果的资料数",
        },
        {
          id: 2,
          title: "闪卡总数",
          value: String(flashcardsCount),
          desc: "当前账号下生成的闪卡数量",
        },
        {
          id: 3,
          title: "总结次数",
          value: String(summariesCount),
          desc: "当前账号下生成的总结数量",
        },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "获取控制台数据失败" },
      { status: 500 }
    );
  }
}
