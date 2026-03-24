import type { StatusKey } from "@/lib/status";
import { statusColor, statusLabel } from "@/lib/status";

type Props = {
  status: StatusKey;
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${statusColor[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}