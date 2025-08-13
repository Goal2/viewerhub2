"use client";
import { ReactNode } from "react";
import AuroraBg from "@/components/AuroraBg";

export default function MouseBg({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-animated">
      <AuroraBg />
      {children}
    </div>
  );
}
