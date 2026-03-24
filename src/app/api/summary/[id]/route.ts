import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBearerTokenFromRequest, verifyToken } from "@/lib/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getBearerTokenFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { id } = await params;
  const summaryId = Number(id);

  if (Number.isNaN(summaryId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const summary = await prisma.summary.findFirst({
    where: { id: summaryId, userId: payload.id },
  });

  if (!summary) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: summary.id,
    type: summary.type,
    title: summary.title,
    period: summary.period,
    content: summary.content,
    keyPoints: Array.isArray(summary.keyPoints) ? summary.keyPoints : [],
    suggestions: Array.isArray(summary.suggestions) ? summary.suggestions : [],
    generatedAt: summary.createdAt.toISOString(),
  });
}
