"use client";

export default function SideDecor() {
  return (
    <>
      {/* lueur gauche */}
      <div className="pointer-events-none fixed inset-y-0 left-0 w-[22vw] bg-gradient-to-r from-[#7c3aed20] via-transparent to-transparent blur-2xl" />
      {/* lueur droite */}
      <div className="pointer-events-none fixed inset-y-0 right-0 w-[22vw] bg-gradient-to-l from-[#06b6d420] via-transparent to-transparent blur-2xl" />
      {/* petits traits diagonaux très discrets */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[.15] [mask-image:radial-gradient(60%_40%_at_50%_30%,#000,transparent)]">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="slants" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="skewX(30)">
              <line x1="0" y1="0" x2="0" y2="32" stroke="white" strokeOpacity=".15" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#slants)" />
        </svg>
      </div>
    </>
  );
}
