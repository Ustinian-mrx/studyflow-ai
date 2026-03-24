import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-md border border-dashed bg-slate-50 p-4 text-sm">
      <div className="text-base font-medium text-slate-900">{title}</div>
      {description ? <div className="text-slate-500">{description}</div> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}