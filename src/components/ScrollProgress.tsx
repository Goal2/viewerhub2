"use client";
import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60]"
      style={{ scaleX: scrollYProgress, transformOrigin: "0% 0%" }}
    >
      <div className="h-full w-full bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]" />
    </motion.div>
  );
}
