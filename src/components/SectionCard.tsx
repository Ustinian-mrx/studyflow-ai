type Props = {
  title: string;
  children?: React.ReactNode;
};

export default function SectionCard({ title, children }: Props) {
  return (
    // 区块容器组件：封装常用卡片边框与内容排版。
    <section className="surface-card p-5 sm:p-6">
      <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}
