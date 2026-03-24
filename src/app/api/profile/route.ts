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

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: {
      documents: true,
      summaries: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const flashcardsCount = await prisma.flashcard.count({
    where: {
      documentId: {
        in: user.documents.map((d) => d.id),
      },
    },
  });

  const derivedTags = Array.from(
    new Set(
      user.documents
        .map((doc) => doc.filename.split(".")[0]?.trim())
        .filter(Boolean)
        .slice(0, 6)
    )
  );

  return NextResponse.json({
    name: user.name,
    email: user.email,
    role: user.role,
    tags: derivedTags.length > 0 ? derivedTags : ["暂未生成学习标签"],
    stats: {
      documents: user.documents.length,
      flashcards: flashcardsCount,
      summaries: user.summaries.length,
    },
  });
}
