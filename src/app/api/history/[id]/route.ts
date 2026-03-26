import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const documentId = Number(id);

    if (Number.isNaN(documentId)) {
      return NextResponse.json({ error: "无效的文档 id" }, { status: 400 });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.id,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    await prisma.summary.deleteMany({
      where: {
        userId: user.id,
        documentId,
      },
    });

    await prisma.flashcard.deleteMany({
      where: { documentId },
    });

    await prisma.analysisResult.deleteMany({
      where: { documentId },
    });

    await prisma.document.delete({
      where: { id: documentId },
    });

    if (document.fileUrl?.startsWith("/uploads/")) {
      const filePath = path.join(
        process.cwd(),
        "public",
        document.fileUrl.replace(/^\/+/, "")
      );

      try {
        await fs.unlink(filePath);
      } catch {
        // 文件不存在也不阻塞删除流程
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "删除失败",
      },
      { status: 500 }
    );
  }
}
