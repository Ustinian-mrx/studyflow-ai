import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { getUploadOption } from "@/data/api";
import type { StatusKey } from "@/lib/status";
import { statusLabel } from "@/lib/status";

export default async function UploadPage() {
  const currentStatus: StatusKey = "analyzing";
  const uploadOption = await getUploadOption();

  return (
    <div className="space-y-6">
      <PageHeader
        title="上传资料"
        description="支持图片和 PDF，上传后将自动生成分析、闪卡与总结。"
      />

      <SectionCard title="上传区域">
        <div className="text-slate-500">拖拽或点击上传文件</div>
        <div className="mt-3 h-32 rounded-md border border-dashed bg-slate-50" />
        <Button className="mt-4">选择文件</Button>
      </SectionCard>

      <SectionCard title="附加选项">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm">学科</label>
            <select className="mt-2 w-full rounded-md border px-3 py-2 text-sm">
              <option>{uploadOption.subject}</option>
              <option>英语</option>
              <option>线性代数</option>
            </select>
          </div>
          <div>
            <label className="text-sm">年级</label>
            <select className="mt-2 w-full rounded-md border px-3 py-2 text-sm">
              <option>{uploadOption.level}</option>
              <option>大二</option>
              <option>大三</option>
            </select>
          </div>
          <div>
            <label className="text-sm">学习目标</label>
            <input
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
              defaultValue={uploadOption.goal}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="处理状态">
        <div className="text-sm text-slate-500">当前状态：{statusLabel[currentStatus]}</div>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 w-1/2 rounded-full bg-slate-900" />
        </div>
      </SectionCard>
    </div>
  );
}
