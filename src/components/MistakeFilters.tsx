"use client";

type MistakeFiltersProps = {
  tags: string[];
  documents: { id: number; name: string }[];
  selectedSource: string;
  selectedTag: string;
  selectedDocument: string;
  selectedMastered: string;
  onSourceChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onDocumentChange: (value: string) => void;
  onMasteredChange: (value: string) => void;
};

export default function MistakeFilters({
  tags,
  documents,
  selectedSource,
  selectedTag,
  selectedDocument,
  selectedMastered,
  onSourceChange,
  onTagChange,
  onDocumentChange,
  onMasteredChange,
}: MistakeFiltersProps) {
  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className={selectClass}
        value={selectedSource}
        onChange={(e) => onSourceChange(e.target.value)}
      >
        <option value="">全部来源</option>
        <option value="ai_difficulty">AI 疑难点</option>
        <option value="wrong_answer">闪卡答错</option>
      </select>

      <select
        className={selectClass}
        value={selectedMastered}
        onChange={(e) => onMasteredChange(e.target.value)}
      >
        <option value="">全部状态</option>
        <option value="false">未掌握</option>
        <option value="true">已掌握</option>
      </select>

      <select
        className={selectClass}
        value={selectedTag}
        onChange={(e) => onTagChange(e.target.value)}
      >
        <option value="">全部标签</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={selectedDocument}
        onChange={(e) => onDocumentChange(e.target.value)}
      >
        <option value="">全部文档</option>
        {documents.map((doc) => (
          <option key={doc.id} value={String(doc.id)}>
            {doc.name}
          </option>
        ))}
      </select>
    </div>
  );
}
