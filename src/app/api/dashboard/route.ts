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

    const latestSummary = await prisma.summary.findFirst({
      where: {
        userId: user.id,
        type: "single",
        documentId: { not: null },
      },
      orderBy: { createdAt: "desc" },
      select: { documentId: true },
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
        { title: "上传资料", href: "/upload" },
        { title: "查看历史", href: "/history" },
        {
          title: "查看总结",
          href: latestSummary?.documentId
            ? `/summary/${latestSummary.documentId}`
            : "/history",
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
