import type { StatusKey } from "@/lib/status";
import { statusColor, statusLabel } from "@/lib/status";

type Props = {
  status: StatusKey;
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      // 颜色与文案都从状态映射读取，避免页面层写死判断分支。
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${statusColor[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}
