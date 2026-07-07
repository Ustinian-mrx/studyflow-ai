import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/server-auth";
import { getExportData } from "@/lib/services/mistake-export";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  HeadingLevel,
} from "docx";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { items, stats } = await getExportData(user.id);

    const headerRow = new TableRow({
      children: ["#", "题目", "答案", "来源", "文档", "标签", "掌握率", "状态"].map(
        (text) =>
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })] })],
            width: { size: 12, type: WidthType.PERCENTAGE },
          })
      ),
    });

    const dataRows = items.map(
      (item, index) =>
        new TableRow({
          children: [
            String(index + 1),
            item.content.substring(0, 60),
            item.answer.substring(0, 50),
            item.source,
            item.documentName,
            item.tags.join(", "),
            `${item.masteryRate}%`,
            item.mastered ? "已掌握" : "未掌握",
          ].map(
            (text) =>
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })],
                width: { size: 12, type: WidthType.PERCENTAGE },
              })
          ),
        })
    );

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "StudyFlow AI - 错题集", bold: true, size: 36 })],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `导出时间：${new Date().toLocaleDateString("zh-CN")}  |  共 ${stats.total} 题  |  已掌握 ${stats.mastered}  |  未掌握 ${stats.unmastered}`,
                  size: 22,
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Table({
              rows: [headerRow, ...dataRows],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="mistakes-${new Date().toISOString().split("T")[0]}.docx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Word 导出失败" },
      { status: 500 }
    );
  }
}
