// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import LedBackground from "@/components/LedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViewerHub",
  description: "Classements style Twitch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#0e0f12] text-white antialiased`}>
        <LedBackground />
        <TopNav />
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
