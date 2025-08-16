import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViewerHub · Classements",
  description: "Dashboard viewers chill · style Twitch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-ink">
      <body className={`${inter.className} noscroll`}>{children}</body>
    </html>
  );
}
