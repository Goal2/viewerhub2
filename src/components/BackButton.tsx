"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  href,
  label = "Retour",
  className = "",
}: {
  href?: string;            // si non fourni -> router.back()
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/10 
                  bg-white/5 px-3 py-2 text-sm hover:bg-white/10 
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
