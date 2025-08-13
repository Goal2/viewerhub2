"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Parallax({
  children,
  from = 40,   // déplacement px au début
  to = -40,    // déplacement px à la fin
  className = "",
}: {
  children: React.ReactNode;
  from?: number;
  to?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
