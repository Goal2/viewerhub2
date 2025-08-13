"use client";
import { ReactNode } from "react";
import Topbar from "@/components/Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
