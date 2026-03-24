import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const summaryId = Number(id);

  if (Number.isNaN(summaryId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const summary = await prisma.summary.findUnique({
    where: { id: summaryId },
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
    keyPoints: summary.keyPoints,
    suggestions: summary.suggestions,
    generatedAt: summary.createdAt,
  });
}