"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "secondary" };

export default function MagneticButton({ href, children, variant = "primary" }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.3 });
  const sy = useSpring(my, { stiffness: 200, damping: 18, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    mx.set(dx * 0.25);
    my.set(dy * 0.25);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center px-6 py-3 rounded-2xl border transition-colors select-none";
  const style =
    variant === "primary"
      ? "bg-white/10 border-white/20 hover:bg-white/20"
      : "bg-fuchsia-400/20 border-fuchsia-400/30 hover:bg-fuchsia-400/30";

  return (
    <motion.div style={{ x: sx, y: sy }}>
      <Link
        href={href}
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`${base} ${style}`}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </Link>
    </motion.div>
  );
}
