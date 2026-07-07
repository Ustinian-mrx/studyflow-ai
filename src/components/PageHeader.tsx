type Props = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: Props) {
  return (
    // 页面主标题组件：保证各业务页在间距与层级上保持一致。
    <div className="mb-6 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
