import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";

export default function HomePage(){
  return (
    <main className="space-y-6">
      <Hero />
      <div className="grid md:grid-cols-3 gap-6">
        <Reveal><div className="card"><div className="h2">Classements</div><p className="sub mt-1">Top chatters, dons, subs.</p></div></Reveal>
        <Reveal delay={.08}><div className="card"><div className="h2">Mon espace</div><p className="sub mt-1">Tes stats personnelles.</p></div></Reveal>
        <Reveal delay={.16}><div className="card"><div className="h2">Connexion streamer</div><p className="sub mt-1">Activer la lecture des subs.</p></div></Reveal>
      </div>
    </main>
  );
}
