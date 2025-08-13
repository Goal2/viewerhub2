"use client";

/** Fond aurora doux, full CSS, safe pour le SSR */
export default function ColorBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -inset-[20%] aurora-blobs animate-aurora" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/70" />
      <style jsx>{`
        @keyframes aurora {
          0%   { transform: translate3d(0,0,0) scale(1);   filter: blur(40px); }
          50%  { transform: translate3d(-3%,2%,0) scale(1.02); filter: blur(60px); }
          100% { transform: translate3d(0,0,0) scale(1);   filter: blur(40px); }
        }
      `}</style>
    </div>
  );
}
