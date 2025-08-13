"use client";

type Props = {
  label?: string;            // tu peux utiliser "label" ou "title"
  title?: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
};

export default function StatCard({
  label,
  title,
  value,
  hint,
  className,
}: Props) {
  const header = label ?? title ?? "";

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 ${className ?? ""}`}>
      <div className="text-xs uppercase tracking-wide text-white/60">{header}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/60">{hint}</div> : null}
    </div>
  );
}
