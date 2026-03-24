import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = Number(id);

    if (Number.isNaN(docId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { id: docId },
      include: { result: true },
    });

    if (!doc || !doc.result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: doc.id,
      filename: doc.filename,
      uploadedAt: doc.uploadedAt,
      status: doc.status,
      summary: doc.result.summary,
      keyPoints: doc.result.keyPoints,
      difficulties: doc.result.difficulties,
      suggestions: doc.result.suggestions,
      tags: doc.result.tags,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
