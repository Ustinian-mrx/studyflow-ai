import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBearerTokenFromRequest, verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const token = getBearerTokenFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const list = await prisma.document.findMany({
    where: { userId: payload.id },
    orderBy: { uploadedAt: "desc" },
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
}
