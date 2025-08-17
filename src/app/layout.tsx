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
        {/* Couche de halos – FIXE et hors des conteneurs */}
        <div className="vh-halos" aria-hidden />

        {/* Tout le contenu de l'app au-dessus des halos */}
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
