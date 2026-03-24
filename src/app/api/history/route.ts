import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const mockUserId = 1;

    const list = await prisma.document.findMany({
      where: {
        userId: mockUserId,
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