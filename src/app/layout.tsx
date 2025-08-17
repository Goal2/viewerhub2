// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViewerHub",
  description:
    "Classements et stats viewers, style Twitch (live, chat & tendances).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} bg-[#0a0c10] text-slate-100 overflow-x-hidden antialiased`}
      >
        {/* Halos fixes – sous tout le contenu */}
        <div className="vh-halos" aria-hidden>
          <div className="halo-layer" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
