import Link from "next/link";

const mock = {
  messages14d: 12457,
  avgPerDay: 889,
  rank: 12,
  hoursWatched: 42,
  tipsTotal: 36,
  subMonths: 8,
};
const mini = [760, 680, 820, 640, 620, 860, 910, 790, 840, 720, 960, 980, 610, 640];

function MiniTrend({ w=320, h=90 }:{ w?:number; h?:number }) {
  const pad = 8;
  const max = Math.max(...mini), min = Math.min(...mini);
  const span = Math.max(1, max - min);
  const step = (w - pad*2) / (mini.length - 1);
  const pts = mini.map((v,i)=>{
    const t = (v - min) / span;
    return [pad + i*step, Math.round(h - pad - t*(h - pad*2))] as const;
  });
  const d = pts.reduce((acc,[x,y],i)=>{
    if(!i) return `M ${x} ${y}`;
    const prev = pts[i-1];
    const cx = (prev[0]+x)/2, cy = (prev[1]+y)/2;
    return acc + ` Q ${prev[0]} ${prev[1]}, ${cx} ${cy} T ${x} ${y}`;
  }, "");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[90px]">
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(167,139,250,.35)"/>
          <stop offset="100%" stopColor="rgba(34,211,238,.05)"/>
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>

      {/* aire douce */}
      {d && <path d={`${d} L ${w-pad} ${h-pad} L ${pad} ${h-pad} Z`} fill="url(#areaGrad)" opacity=".5" />}
      {/* lueur discrète */}
      <path d={d} stroke="#a78bfa" strokeWidth="8" opacity=".1" fill="none" />
      {/* ligne nette */}
      <path d={d} stroke="url(#lineGrad)" strokeWidth="2.5" fill="none" />
      {/* points soft */}
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.5" fill="#c4b5fd" className="animate-glowPulse" />)}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* halos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-10 h-[48rem] w-[48rem] rounded-full bg-gradient-to-tr from-fuchsia-600/30 via-purple-500/20 to-cyan-400/20 blur-3xl animate-floatA" />
        <div className="absolute -right-52 bottom-12 h-[50rem] w-[50rem] rounded-full bg-gradient-to-tr from-cyan-400/25 via-teal-400/20 to-fuchsia-500/20 blur-3xl animate-floatB" />
        <div className="absolute left-[42%] top-[44%] h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-500/18 via-fuchsia-500/14 to-cyan-400/16 blur-3xl animate-floatC" />
        <div className="absolute left-1/2 bottom-[8%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/14 via-indigo-500/10 to-cyan-400/12 blur-3xl animate-floatD" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <section className="card p-8 md:p-10 shadow-glow">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]">
            Bienvenue sur ViewerHub
          </h1>
          <p className="mt-2 text-white/80 max-w-2xl">
            Connecte ton compte Twitch et découvre tes <span className="font-semibold">classements</span>,
            ton <span className="font-semibold">activité de chat</span>, tes <span className="font-semibold">heures</span> devant le stream,
            tes <span className="font-semibold">tips/subs</span>… le tout dans une interface inspirée de Twitch.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/api/auth/signin" className="btn-primary">
              🚀 Se connecter avec Twitch
            </Link>
            <Link href="/classements" className="btn">
              Explorer les classements
            </Link>
          </div>
        </section>

        {/* Aperçu “ce que tu verras en te connectant” */}
        <section className="mt-8 grid gap-6 md:grid-cols-5">
          {/* KPI */}
          <div className="card p-5 md:col-span-2">
            <div className="text-sm text-white/60">Aperçu de tes stats (exemple)</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Messages / 14j</div>
                <div className="text-xl font-bold">{mock.messages14d.toLocaleString("fr-FR")}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Moyenne / jour</div>
                <div className="text-xl font-bold">{mock.avgPerDay.toLocaleString("fr-FR")}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Heures vues</div>
                <div className="text-xl font-bold">{mock.hoursWatched} h</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Rang (mock)</div>
                <div className="text-xl font-bold">#{mock.rank}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 col-span-2">
                <div className="text-xs text-white/60">Tips & Sub</div>
                <div className="text-xl font-bold">{mock.tipsTotal} tips • {mock.subMonths} mois</div>
              </div>
            </div>
          </div>

          {/* mini Trend */}
          <div className="card p-5 md:col-span-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Ta tendance récente (exemple)</div>
              <div className="text-xs text-white/60">Activité du chat</div>
            </div>
            <MiniTrend />
            <p className="mt-2 text-xs text-white/60">
              En te connectant, cette courbe sera basée sur tes vraies données.
            </p>
          </div>
        </section>

        {/* Bénéfices */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["👑 Classements fun", "Compare-toi aux autres viewers : messages, tips et mois de sub."],
            ["📈 Stats perso", "Historique, tendances, estimations de rang et objectifs."],
            ["⚡ Temps réel", "Données actualisées très souvent, comme sur Twitch."],
          ].map(([title,desc])=>(
            <div key={title} className="card p-5">
              <div className="text-lg font-semibold">{title}</div>
              <p className="text-white/70">{desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
