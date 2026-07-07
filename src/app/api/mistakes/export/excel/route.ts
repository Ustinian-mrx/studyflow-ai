import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/server-auth";
import { getExportData } from "@/lib/services/mistake-export";
import ExcelJS from "exceljs";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { items, stats } = await getExportData(user.id);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "StudyFlow AI";
    workbook.created = new Date();

    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, color: { argb: "FFFFFFFF" }, size: 11 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } },
      alignment: { horizontal: "center", vertical: "middle" },
    };

    // Sheet 1: 错题详情
    const detailSheet = workbook.addWorksheet("错题详情");
    detailSheet.columns = [
      { header: "序号", key: "index", width: 8 },
      { header: "题目", key: "content", width: 50 },
      { header: "答案", key: "answer", width: 40 },
      { header: "来源", key: "source", width: 15 },
      { header: "所属文档", key: "documentName", width: 25 },
      { header: "标签", key: "tags", width: 20 },
      { header: "答对次数", key: "correctCount", width: 12 },
      { header: "答错次数", key: "wrongCount", width: 12 },
      { header: "掌握率", key: "masteryRate", width: 12 },
      { header: "状态", key: "status", width: 10 },
      { header: "添加时间", key: "createdAt", width: 15 },
    ];
    applyHeaderStyle(detailSheet.getRow(1), headerStyle);

    items.forEach((item, index) => {
      detailSheet.addRow({
        index: index + 1,
        content: item.content,
        answer: item.answer,
        source: item.source,
        documentName: item.documentName,
        tags: item.tags.join(", "),
        correctCount: item.correctCount,
        wrongCount: item.wrongCount,
        masteryRate: item.masteryRate / 100,
        status: item.mastered ? "已掌握" : "未掌握",
        createdAt: item.createdAt,
      });
    });

    detailSheet.getColumn("masteryRate").numFmt = "0%";

    // Sheet 2: 文档统计
    const docSheet = workbook.addWorksheet("文档统计");
    docSheet.columns = [
      { header: "文档名称", key: "document", width: 30 },
      { header: "错题数量", key: "count", width: 15 },
      { header: "平均掌握率", key: "masteryRate", width: 15 },
    ];
    applyHeaderStyle(docSheet.getRow(1), headerStyle);

    stats.byDocument.forEach((doc) => {
      docSheet.addRow({
        document: doc.document,
        count: doc.count,
        masteryRate: doc.masteryRate / 100,
      });
    });
    docSheet.getColumn("masteryRate").numFmt = "0%";

    // Sheet 3: 标签统计
    const tagSheet = workbook.addWorksheet("标签统计");
    tagSheet.columns = [
      { header: "标签", key: "tag", width: 20 },
      { header: "错题数量", key: "count", width: 15 },
      { header: "平均掌握率", key: "masteryRate", width: 15 },
    ];
    applyHeaderStyle(tagSheet.getRow(1), headerStyle);

    stats.byTag.forEach((tag) => {
      tagSheet.addRow({
        tag: tag.tag,
        count: tag.count,
        masteryRate: tag.masteryRate / 100,
      });
    });
    tagSheet.getColumn("masteryRate").numFmt = "0%";

    // Sheet 4: 时间趋势
    const weekSheet = workbook.addWorksheet("时间趋势");
    weekSheet.columns = [
      { header: "周起始日", key: "week", width: 15 },
      { header: "新增错题数", key: "newCount", width: 15 },
      { header: "累计错题数", key: "totalCount", width: 15 },
    ];
    applyHeaderStyle(weekSheet.getRow(1), headerStyle);

    stats.byWeek.forEach((week) => {
      weekSheet.addRow({
        week: week.week,
        newCount: week.newCount,
        totalCount: week.totalCount,
      });
    });

    // Sheet 5: 掌握评估
    const assessSheet = workbook.addWorksheet("掌握评估");
    assessSheet.columns = [
      { header: "指标", key: "label", width: 20 },
      { header: "数值", key: "value", width: 15 },
    ];
    applyHeaderStyle(assessSheet.getRow(1), headerStyle);

    assessSheet.addRow({ label: "总题数", value: stats.total });
    assessSheet.addRow({ label: "已掌握", value: stats.mastered });
    assessSheet.addRow({ label: "未掌握", value: stats.unmastered });
    assessSheet.addRow({
      label: "整体掌握率",
      value: stats.total > 0 ? stats.mastered / stats.total : 0,
    });
    assessSheet.addRow({ label: "", value: "" });
    assessSheet.addRow({ label: "按来源统计", value: "" });
    stats.bySource.forEach((src) => {
      assessSheet.addRow({ label: src.source, value: src.count });
    });

    const masteryRateCell = assessSheet.getCell("B4");
    masteryRateCell.numFmt = "0%";

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="mistakes-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Excel 导出失败" },
      { status: 500 }
    );
  }
}

function applyHeaderStyle(row: ExcelJS.Row, style: Partial<ExcelJS.Style>) {
  row.eachCell((cell) => {
    if (style.font) cell.font = style.font;
    if (style.fill) cell.fill = style.fill as ExcelJS.Fill;
    if (style.alignment) cell.alignment = style.alignment as ExcelJS.Alignment;
  });
}
