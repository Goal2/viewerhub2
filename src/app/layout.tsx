import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViewerHub",
  description: "Stats & classements viewers (style Twitch) pour theaubeurre.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Halos globaux très doux */}
        <div className="main-bg">
          <div className="halo halo--purple" style={{ left: "22%", top: "18%" }} />
          <div className="halo halo--cyan" style={{ left: "78%", top: "68%" }} />
        </div>

        {/* Barre top style Twitch */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b10]/70 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-white">
              <span className="text-[#9146ff]">Viewer</span>Hub
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/" className="btn">Accueil</Link>
              <Link href="/classements" className="btn">Classements</Link>
            </nav>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
