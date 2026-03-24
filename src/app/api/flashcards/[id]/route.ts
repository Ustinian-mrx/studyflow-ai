import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const docId = Number(id);

  if (Number.isNaN(docId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const doc = await prisma.document.findUnique({
    where: { id: docId },
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

  return NextResponse.json({
    id: doc.id,
    documentName: doc.filename,
    total: list.length,
    categories: 0,
    tags: [],
    items: list.map((c) => ({
      id: c.id,
      question: c.question,
      answer: c.answer,
      tags: c.tags ?? [],
    })),
  });
}