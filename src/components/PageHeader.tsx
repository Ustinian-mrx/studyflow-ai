type Props = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
