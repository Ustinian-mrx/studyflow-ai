import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const list = await prisma.document.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      select: {
        id: true,
        filename: true,
        uploadedAt: true,
        status: true,
      },
    });

    return NextResponse.json(
      list.map((item) => ({
        id: item.id,
        name: item.filename,
        time: item.uploadedAt.toISOString().slice(0, 16).replace("T", " "),
        status: item.status,
      }))
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "获取历史记录失败",
      },
      { status: 500 }
    );
  }
}