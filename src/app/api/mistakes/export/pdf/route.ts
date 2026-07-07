import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/server-auth";
import { getExportData } from "@/lib/services/mistake-export";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { items, stats } = await getExportData(user.id);

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("StudyFlow AI - 错题集", 14, 22);

    doc.setFontSize(10);
    doc.text(`导出时间：${new Date().toLocaleDateString("zh-CN")}`, 14, 30);
    doc.text(`共 ${stats.total} 题 · 已掌握 ${stats.mastered} · 未掌握 ${stats.unmastered}`, 14, 36);

    autoTable(doc, {
      startY: 44,
      head: [["#", "题目", "答案", "来源", "文档", "标签", "掌握率", "状态"]],
      body: items.map((item, index) => [
        String(index + 1),
        item.content.substring(0, 40) + (item.content.length > 40 ? "..." : ""),
        item.answer.substring(0, 30) + (item.answer.length > 30 ? "..." : ""),
        item.source,
        item.documentName.substring(0, 20),
        item.tags.join(", "),
        `${item.masteryRate}%`,
        item.mastered ? "已掌握" : "未掌握",
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
      },
    });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="mistakes-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "PDF 导出失败" },
      { status: 500 }
    );
  }
}
