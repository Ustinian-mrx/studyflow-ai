import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  href?: string;
  className?: string;
};

export default function ListItem({ title, subtitle, right, href, className }: Props) {
  const content = (
    <div
      className={`flex items-center justify-between gap-3 rounded-md border p-3 hover:bg-slate-50 ${
        className ?? ""
      }`}
    >
      <div>
        <div className="text-sm font-medium">{title}</div>
        {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}