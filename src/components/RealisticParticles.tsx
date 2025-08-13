"use client";
import { useEffect, useRef } from "react";

type P = { x:number; y:number; vx:number; vy:number; r:number; layer:number; tw:number };

export default function RealisticParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ps = useRef<P[]>([]);
  const mouse = useRef<{x:number;y:number}|null>(null);
  const stop = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, t = 0;

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // densité ↑
      const COUNT = Math.floor((w * h) / 12000);
      ps.current = new Array(COUNT).fill(0).map(() => {
        const layer = Math.random(); // 0..1 (loin..près)
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - .5) * .15,
          vy: (Math.random() - .5) * .15,
          r: 0.7 + layer * 1.0,
          layer,
          tw: Math.random() * Math.PI * 2, // phase de twinkle
        };
      });
    };
    resize();
    window.addEventListener("resize", resize);

    // petit champ “bruit” lissé (pas de lib)
    const flow = (x:number, y:number, tt:number) => {
      const s1 = Math.sin(x*0.0011 + tt*0.25);
      const c1 = Math.cos(y*0.0013 - tt*0.22);
      const s2 = Math.sin((x+y)*0.0007 + tt*0.18);
      const ang = s1*0.9 + c1*0.7 + s2*0.6;         // angle en radians
      const spd = 0.08 + 0.06*Math.sin(tt*0.3 + x*0.0005); // vitesse max
      return { ax: Math.cos(ang)*spd, ay: Math.sin(ang)*spd };
    };

    const loop = () => {
      t += 0.016;
      const w = window.innerWidth, h = window.innerHeight;

      // lavis très léger
      const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
      g.addColorStop(0, "rgba(99,102,241,0.03)");
      g.addColorStop(1, "rgba(236,72,153,0.03)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,canvas.width,canvas.height);

      const M = mouse.current;

      for (let i = 0; i < ps.current.length; i++) {
        const p = ps.current[i];

        // force du champ
        const { ax, ay } = flow(p.x, p.y, t);
        p.vx += ax * (0.6 + p.layer*0.6);
        p.vy += ay * (0.6 + p.layer*0.6);

        // très légère répulsion souris (quasi nulle)
        if (M) {
          const dx = p.x - M.x, dy = p.y - M.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 9000) {
            p.vx += (dx) * 0.00001;
            p.vy += (dy) * 0.00001;
          }
        }

        // damping doux
        p.vx *= 0.985; p.vy *= 0.985;

        p.x += p.vx; p.y += p.vy;

        // wrap bords
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // rendu: petits points + twinkle subtil
        p.tw += 0.03 + p.layer*0.02;
        const alpha = 0.25 + p.layer*0.35 + Math.sin(p.tw)*0.05;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();

        // quelques liens doux
        for (let j = i+1; j < i+5 && j < ps.current.length; j++) {
          const q = ps.current[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 110*110) {
            const a = 1 - d2/(110*110);
            ctx.strokeStyle = `rgba(255,255,255,${0.08*a})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => (mouse.current = { x: e.clientX, y: e.clientY });
    const onLeave = () => (mouse.current = null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    raf = requestAnimationFrame(loop);

    stop.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
    return () => stop.current();
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />;
}
