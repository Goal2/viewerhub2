"use client";
import { useEffect, useRef } from "react";

type Dot = { x:number; y:number; vx:number; vy:number };

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef<{ x:number; y:number } | null>(null);
  const stopRef  = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const { innerWidth:w, innerHeight:h } = window;
      canvas.width  = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR,0,0,DPR,0,0);
    };
    resize();
    window.addEventListener("resize", resize);

    // densité ↑ (calme mais présent)
    const COUNT = Math.floor((window.innerWidth * window.innerHeight) / 14000);
    dotsRef.current = new Array(COUNT).fill(0).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
    }));

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // lavis très léger (pas de bandes)
      const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
      g.addColorStop(0,"rgba(99,102,241,0.025)");
      g.addColorStop(1,"rgba(236,72,153,0.025)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,canvas.width,canvas.height);

      const M = mouseRef.current;
      ctx.lineWidth = 1;

      for (let i=0;i<dotsRef.current.length;i++){
        const d = dotsRef.current[i];

        // attraction faible + portée réduite
        if (M){
          const dx = M.x - d.x, dy = M.y - d.y;
          const dist2 = dx*dx + dy*dy;
          if (dist2 < 16000){
            d.vx += dx * 0.000012;
            d.vy += dy * 0.000012;
          }
        }

        d.x += d.vx; d.y += d.vy;

        // wrap bords
        if (d.x < -20) d.x = window.innerWidth + 20;
        if (d.x > window.innerWidth + 20) d.x = -20;
        if (d.y < -20) d.y = window.innerHeight + 20;
        if (d.y > window.innerHeight + 20) d.y = -20;

        // point
        ctx.fillStyle = "rgba(255,255,255,0.32)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.05, 0, Math.PI*2);
        ctx.fill();

        // liens doux
        for (let j=i+1;j<i+6 && j<dotsRef.current.length;j++){
          const d2 = dotsRef.current[j];
          const dx = d.x - d2.x, dy = d.y - d2.y;
          const dist2 = dx*dx + dy*dy;
          if (dist2 < 130*130){
            const a = 1 - dist2/(130*130);
            ctx.strokeStyle = `rgba(255,255,255,${0.10*a})`;
            ctx.beginPath();
            ctx.moveTo(d.x,d.y);
            ctx.lineTo(d2.x,d2.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove  = (e:MouseEvent) => (mouseRef.current = { x:e.clientX, y:e.clientY });
    const onLeave = () => (mouseRef.current = null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    raf = requestAnimationFrame(draw);

    stopRef.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
    return () => stopRef.current();
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />;
}
