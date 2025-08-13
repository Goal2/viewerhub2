"use client";
import { useRef } from "react";

export default function TiltCard({ title, subtitle }: { title: string; subtitle: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${py * -8}deg`);
    el.style.setProperty("--ry", `${px * 12}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current!;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur"
      style={{
        transform: "perspective(800px) rotateX(var(--rx,0)) rotateY(var(--ry,0))",
        transition: "transform 120ms ease",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.12), transparent 40%)",
          transition: "opacity 150ms ease",
        }}
      />
      <div className="relative z-10">
        <div className="text-sm uppercase tracking-widest text-white/60">{subtitle}</div>
        <div className="mt-1 text-xl font-semibold">{title}</div>
      </div>
    </div>
  );
}
