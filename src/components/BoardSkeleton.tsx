"use client";
export default function BoardSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <div className="h-5 w-40 rounded bg-white/10" />
      </div>
      <ul className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 text-center">
                <div className="h-4 w-6 mx-auto rounded bg-white/10" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-white/10" />
                <div className="mt-2 h-2 rounded bg-white/10" />
              </div>
              <div className="h-4 w-16 rounded bg-white/10" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
