// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "ViewerHub",
  description: "Classements & live twitch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${inter.variable} font-sans min-h-screen bg-[#0b0b12] text-white antialiased`}
      >
        {/* grands dégradés d’ambiance */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* halo central */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
            <div className="absolute -top-24 left-0 right-0 h-[36rem] bg-gradient-to-b from-[#7c3aed1f] via-transparent to-transparent blur-3xl" />
          </div>
          {/* côtés */}
          <div className="absolute inset-y-0 left-0 w-[30vw] bg-[linear-gradient(90deg,#7c3aed22,transparent)] blur-2xl" />
          <div className="absolute inset-y-0 right-0 w-[30vw] bg-[linear-gradient(270deg,#06b6d422,transparent)] blur-2xl" />
        </div>

        {children}
      </body>
    </html>
  );
}
