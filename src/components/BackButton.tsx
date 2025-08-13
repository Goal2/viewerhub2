"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  /** Fallback si on ne peut pas history.back() */
  href?: string;
  /** Classes supplémentaires pour positionner/styliser */
  className?: string;
  /** Libellé (optionnel) */
  label?: string;
};

export default function BackButton({
  href = "/me",
  className = "",
  label = "Retour",
}: Props) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // si l’historique a au moins 2 entrées, on peut revenir en arrière
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  const goBack = () => {
    if (canGoBack) router.back();
    else router.push(href);
  };

  return (
    <button
      onClick={goBack}
      className={
        `group inline-flex items-center gap-2 rounded-xl border border-white/15 
         bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 
         focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60
         shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]
         ${className}`
      }
      aria-label={label}
    >
      {/* icône chevron */}
      <svg
        className="h-4 w-4 -ml-0.5 shrink-0 opacity-80 group-hover:opacity-100"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
