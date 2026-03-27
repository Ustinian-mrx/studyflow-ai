import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/server-auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const weeklySummaries = await prisma.summary.findMany({
      where: {
        userId: user.id,
        type: "weekly",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        period: true,
        periodStart: true,
        periodEnd: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      weeklySummaries.map((item) => ({
        id: item.id,
        title: item.title,
        period: item.period ?? "",
        periodStart: item.periodStart?.toISOString() ?? "",
        periodEnd: item.periodEnd?.toISOString() ?? "",
        createdAt: item.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "获取周总结列表失败",
      },
      { status: 500 }
    );
  }
}
