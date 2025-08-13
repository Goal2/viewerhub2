"use client";
import { motion, Variants } from "framer-motion";
export default function Reveal({ children, delay=0 }:{ children:React.ReactNode; delay?:number }) {
  const v: Variants = { hidden:{opacity:0,y:18}, show:{opacity:1,y:0,transition:{duration:.55, ease:[.22,1,.36,1], delay}} };
  return <motion.div initial="hidden" whileInView="show" viewport={{ once:true, amount:.35 }} variants={v}>{children}</motion.div>;
}
