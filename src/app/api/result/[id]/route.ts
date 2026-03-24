import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBearerTokenFromRequest, verifyToken } from "@/lib/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getBearerTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const docId = Number(id);

    if (Number.isNaN(docId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: payload.id },
      include: { result: true },
    });

    if (!doc || !doc.result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: doc.id,
      filename: doc.filename,
      uploadedAt: doc.uploadedAt.toISOString(),
      status: doc.status,
      summary: doc.result.summary,
      keyPoints: Array.isArray(doc.result.keyPoints) ? doc.result.keyPoints : [],
      difficulties: Array.isArray(doc.result.difficulties)
        ? doc.result.difficulties
        : [],
      suggestions: Array.isArray(doc.result.suggestions)
        ? doc.result.suggestions
        : [],
      tags: Array.isArray(doc.result.tags) ? doc.result.tags : [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
