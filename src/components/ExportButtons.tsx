"use client";

import { Button } from "@/components/ui/button";

type ExportButtonsProps = {
  disabled?: boolean;
};

export default function ExportButtons({ disabled }: ExportButtonsProps) {
  function handleExport(format: "pdf" | "word" | "excel") {
    const url = `/api/mistakes/export/${format}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `mistakes.${format === "word" ? "docx" : format === "excel" ? "xlsx" : "pdf"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("pdf")}
        disabled={disabled}
      >
        导出 PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("word")}
        disabled={disabled}
      >
        导出 Word
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("excel")}
        disabled={disabled}
      >
        导出 Excel
      </Button>
    </div>
  );
}
