type Props = {
  title: string;
  children?: React.ReactNode;
};

export default function SectionCard({ title, children }: Props) {
  return (
    // 区块容器组件：封装常用卡片边框与内容排版。
    <section className="rounded-lg border bg-white p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3 text-sm text-slate-600">{children}</div>
    </section>
  );
}
