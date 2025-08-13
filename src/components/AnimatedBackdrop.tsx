// src/components/AnimatedBackdrop.tsx
// Seamless aurora backdrop (no visible loop). Safe for SSR (no window access).

export default function AnimatedBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* static halos */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(900px 500px at 15% -10%, rgba(124, 58, 237, .26), transparent 60%),
             radial-gradient(900px 500px at 85% -10%, rgba(34, 211, 238, .26), transparent 60%)`,
          filter: "saturate(120%)",
        }}
      />

      {/* aurora layers (rotate = seamless) */}
      <div className="aurora-layer" />
      <div className="aurora-layer aurora-2" />

      {/* subtle grid */}
      <svg className="absolute inset-0 opacity-[0.08]">
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* faint film grain to hide banding a bit */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.05]" style={{
        backgroundImage:
          `radial-gradient(circle at 25% 30%, rgba(255,255,255,.8) 0.5px, transparent 1px),
           radial-gradient(circle at 75% 70%, rgba(255,255,255,.8) 0.5px, transparent 1px)`,
        backgroundSize: "3px 3px, 3px 3px",
      }}/>
    </div>
  );
}
