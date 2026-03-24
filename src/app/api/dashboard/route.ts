import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const mockUserId = 1;

    const recentDocuments = await prisma.document.findMany({
      where: {
        userId: mockUserId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        filename: true,
        uploadedAt: true,
        status: true,
      },
    });

    const documentsCount = await prisma.document.count({
      where: {
        userId: mockUserId,
      },
    });

    const userDocuments = await prisma.document.findMany({
      where: {
        userId: mockUserId,
      },
      select: {
        id: true,
      },
    });

    const documentIds = userDocuments.map((item) => item.id);

    const flashcardsCount = documentIds.length
      ? await prisma.flashcard.count({
          where: {
            documentId: {
              in: documentIds,
            },
          },
        })
      : 0;

    const summariesCount = await prisma.summary.count({
      where: {
        userId: mockUserId,
      },
    });

    return NextResponse.json({
      quick: [
        { title: "上传资料", href: "/upload" },
        { title: "查看历史", href: "/history" },
      ],
      recentUploads: recentDocuments.map((item) => ({
        id: item.id,
        name: item.filename,
        time: item.uploadedAt.toISOString().slice(0, 16).replace("T", " "),
        status: item.status,
      })),
      recentOutputs: [
        {
          id: 1,
          title: "累计资料",
          value: `${documentsCount} 份`,
          desc: "当前账号已上传的资料总数",
        },
        {
          id: 2,
          title: "累计闪卡",
          value: `${flashcardsCount} 张`,
          desc: "系统已生成的闪卡总数",
        },
        {
          id: 3,
          title: "累计总结",
          value: `${summariesCount} 篇`,
          desc: "系统已生成的总结总数",
        },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "获取首页数据失败",
      },
      { status: 500 }
    );
  }
}
