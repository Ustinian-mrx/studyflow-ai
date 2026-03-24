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
  const docId = Number(id);

  if (Number.isNaN(docId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const doc = await prisma.document.findFirst({
    where: { id: docId, userId: payload.id },
  });

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const list = await prisma.flashcard.findMany({
    where: { documentId: docId },
    select: {
      id: true,
      question: true,
      answer: true,
      tags: true,
    },
  });

  const allTags = list.flatMap((c) => (Array.isArray(c.tags) ? c.tags : []));

  return NextResponse.json({
    id: doc.id,
    documentName: doc.filename,
    total: list.length,
    categories: new Set(allTags).size,
    tags: Array.from(new Set(allTags)),
    items: list.map((c) => ({
      id: c.id,
      question: c.question,
      answer: c.answer,
      tags: Array.isArray(c.tags) ? c.tags : [],
    })),
  });
}
