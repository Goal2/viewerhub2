// src/app/page.tsx
"use client";

import { useMemo } from "react";
import useSWR from "swr";

/* ----------------------------- helpers ----------------------------- */
const fetcher = (url: string) => fetch(url).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

type StreamInfo = {
  online: boolean;
  title?: string;
  game?: string;
  viewers?: number;
  started_at?: string;
};

type Pt = { x: number; y: number };

/* ----------------------------- graph ------------------------------- */
const MOCK_TREND = [6, 9, 13, 8, 7, 12, 10, 5, 3, 4, 7, 7, 5, 9];

function SmoothLine({
  width = 640,
  height = 260,
  values,
}: {
  width?: number;
  height?: number;
  values: number[];
}) {
  const pad = 22;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const pts: Pt[] = useMemo(() => {
    const max = Math.max(...values, 1);
    const step = w / Math.max(values.length - 1, 1);
    return values.map((v, i) => ({
      x: pad + i * step,
      y: pad + h - (v / max) * h,
    }));
  }, [values, w, h]);

  const path = useMemo(() => {
    if (pts.length < 2) return "";
    const d: string[] = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (i === 0) d.push(`M ${p.x},${p.y}`);
      else {
        const p0 = pts[i - 1];
        // courbe lissée (bézier)
        const cx1 = p0.x + (p.x - p0.x) / 2;
        const cy1 = p0.y;
        const cx2 = p0.x + (p.x - p0.x) / 2;
        const cy2 = p.y;
        d.push(`C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`);
      }
    }
    return d.join(" ");
  }, [pts]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      role="img"
      aria-label="Courbe d'activité du chat (exemple)"
    >
      {/* grille discrète */}
      <g opacity={0.25}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={pad}
            x2={width - pad}
            y1={pad + ((height - pad * 2) / 4) * i}
            y2={pad + ((height - pad * 2) / 4) * i}
            stroke="url(#gridStroke)"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={i}
            y1={pad}
            y2={height - pad}
            x1={pad + ((width - pad * 2) / 6) * i}
            x2={pad + ((width - pad * 2) / 6) * i}
            stroke="url(#gridStroke)"
          />
        ))}
      </g>

      <defs>
        <linearGradient id="gridStroke" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="fillGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* aplat sous la courbe */}
      <path
        d={`${path} L ${width - pad},${height - pad} L ${pad},${height - pad} Z`}
        fill="url(#fillGrad)"
      />
      {/* la courbe */}
      <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth={3} />
    </svg>
  );
}

/* ----------------------------- live card ---------------------------- */
function LiveCard() {
  const { data } = useSWR<StreamInfo>(
    "/api/twitch/stream?channel=theaubeurre",
    fetcher,
    { refreshInterval: 30_000 }
  );

  const online = data?.online;

  // parent pour l’iframe Twitch (doit correspondre à ta variable d'env sur Vercel)
  const parent =
    process.env.NEXT_PUBLIC_TWITCH_PARENT || "localhost";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 shadow-[0_0_120px_-30px_rgba(99,102,241,.35)]">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10">
        <div className="font-medium">theaubeurre</div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              online ? "bg-emerald-400 shadow-[0_0_12px_2px_rgba(16,185,129,.6)]" : "bg-slate-400"
            }`}
          />
          {online ? "En ligne" : "Hors ligne"}
        </div>
      </div>

      <div className="p-2 sm:p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 to-slate-950">
          {online ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://player.twitch.tv/?channel=theaubeurre&parent=${parent}&muted=true&autoplay=true`}
              allow="autoplay; picture-in-picture; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-sm text-white/70">
                  Hors ligne pour le moment
                </div>
                <div className="mt-1 text-xs text-white/50">
                  Le lecteur s’affichera automatiquement dès que le stream
                  commencera.
                </div>
              </div>
            </div>
          )}
          {/* glow subtil en fond */}
          <div className="pointer-events-none absolute -inset-20 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,.25),_transparent_60%)] blur-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- stats tile --------------------------- */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[11rem]">
      <div className="text-xs tracking-widest text-white/60">{label}</div>
      <div className="mt-2 text-3xl sm:text-4xl font-semibold">{value}</div>
    </div>
  );
}

/* ----------------------------- page -------------------------------- */
export default function HomePage() {
  // mock de stats d’exemple
  const messages14 = 12457;
  const avgDay = 889;
  const hours = 42;
  const rank = 12;

  return (
    <main className="relative mx-auto max-w-7xl px-5 sm:px-6 md:px-8 py-10 sm:py-12">
      {/* Titre + CTA */}
      <section className="mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">ViewerHub</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/75">
          Connecte ton compte Twitch et découvre tes <strong>classements</strong>, ton
          <strong> activité de chat</strong>, tes heures devant le stream, tes <strong>tips/subs</strong>…
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/15 px-4 py-2 text-[15px] font-medium text-violet-200 hover:bg-violet-500/25 transition-colors"
          >
            🚀 Se connecter avec Twitch
          </a>
          <a
            href="/classements"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[15px] font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Explorer les classements
          </a>
        </div>
      </section>

      {/* Stats en une ligne, sans chevauchement */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          <Stat label="MESSAGES / 14J" value={nf.format(messages14)} />
          <Stat label="MOYENNE / JOUR" value={nf.format(avgDay)} />
          <Stat label="HEURES VUES" value={`${hours} h`} />
          <Stat label="RANG (mock)" value={`#${rank}`} />
        </div>
      </section>

      {/* Grille : à gauche le graphique, à droite la carte Live */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
          <div className="mb-2 flex items-end justify-between">
            <div className="text-sm font-medium">Ta tendance récente (exemple)</div>
            <div className="text-xs text-white/50">Activité du chat</div>
          </div>
          <div className="h-[260px]">
            <SmoothLine values={MOCK_TREND} />
          </div>
          <div className="mt-3 text-xs text-white/50">
            En te connectant, cette courbe sera basée sur tes vraies données.
          </div>
        </div>

        <div className="lg:col-span-5">
          <LiveCard />
        </div>
      </section>
    </main>
  );
}
