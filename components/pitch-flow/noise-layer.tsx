"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 2);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  depth: number;

  ivx = 0;
  ivy = 0;

  hit = false;

  // Each dot gets a stable personal “phase”
  phase = Math.random() * Math.PI * 2;

  constructor(w: number, h: number, depth: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.depth = depth;

    this.size = (0.6 + Math.random() * 1.2) * depth;

    const baseV = (0.02 + Math.random() * 0.05) * depth;
    const dir = Math.random() * Math.PI * 2;
    this.vx = Math.cos(dir) * baseV;
    this.vy = Math.sin(dir) * baseV;
  }

  applyWavePush(cx: number, cy: number) {
    const dx = this.x - cx;
    const dy = this.y - cy;
    const dist = Math.max(30, Math.hypot(dx, dy));
    const ux = dx / dist;
    const uy = dy / dist;

    const strength = 0.9 + 1.4 * (1 - clamp(dist / 900, 0, 1));
    const impulse = strength * this.depth * 2.2;

    this.ivx += ux * impulse;
    this.ivy += uy * impulse;
    this.hit = true;
  }

  update(w: number, h: number, speedMul: number, turb: number, time: number) {
    // Gentle turbulence for “busy mind”
    const nx = this.x / w;
    const ny = this.y / h;
    const t = time * 0.00012;

    const swirl =
      Math.sin((nx * 10 + t) * Math.PI * 2) *
      Math.cos((ny * 8 - t) * Math.PI * 2);

    const ax = Math.cos((ny * 7 + t) * Math.PI * 2) * turb * 0.06 * swirl;
    const ay = Math.sin((nx * 9 - t) * Math.PI * 2) * turb * 0.06 * swirl;

    this.vx += ax;
    this.vy += ay;

    const maxBase = 0.22 * this.depth;
    this.vx = clamp(this.vx, -maxBase, maxBase);
    this.vy = clamp(this.vy, -maxBase, maxBase);

    // Decay wave impulse
    this.ivx *= 0.92;
    this.ivy *= 0.92;

    this.x += this.vx * speedMul + this.ivx;
    this.y += this.vy * speedMul + this.ivy;

    // Wrap
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
    if (this.y > h + 10) this.y = -10;
  }

  draw(ctx: CanvasRenderingContext2D, alpha: number) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
}

export function NoiseLayer({
  scrollYProgress,
  waveT,
  restlessT,
  entrainT,
}: {
  scrollYProgress: MotionValue<number>;
  waveT: MotionValue<number>;
  restlessT: MotionValue<number>; // 1->0 through the wave transition
  entrainT: MotionValue<number>; // 0->1 after wave
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  const speedMulRef = useRef(1.0);
  const turbRef = useRef(1.0);
  const baseAlphaRef = useRef(0.18);

  const waveTRef = useRef(0);
  const restlessRef = useRef(1);
  const entrainRef = useRef(0);

  useMotionValueEvent(
    waveT,
    "change",
    (v) => (waveTRef.current = clamp(v, 0, 1)),
  );
  useMotionValueEvent(
    restlessT,
    "change",
    (v) => (restlessRef.current = clamp(v, 0, 1)),
  );
  useMotionValueEvent(
    entrainT,
    "change",
    (v) => (entrainRef.current = clamp(v, 0, 1)),
  );

  // Keep some slow movement always; restlessness controls how “busy” it feels
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = clamp(p, 0, 1);
    speedMulRef.current = 1.05 + (0.35 - 1.05) * clamp(t / 0.7, 0, 1);
    baseAlphaRef.current = 0.19 + (0.09 - 0.19) * clamp(t / 0.85, 0, 1);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const build = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const w = canvas.width;
      const h = canvas.height;

      // Keep stable-ish density
      const count = Math.min(650, Math.max(420, Math.floor((w * h) / 5200)));

      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        const depth = r < 0.55 ? 0.6 : r < 0.88 ? 0.95 : 1.25;
        arr.push(new Particle(w, h, depth));
      }
      particles.current = arr;
    };

    const resize = () => build();

    build();
    window.addEventListener("resize", resize);

    let raf = 0;

    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => p.draw(ctx, 0.12));
    };

    const loop = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      const wt = waveTRef.current;
      const rRestless = restlessRef.current; // 1 => noisy
      const e = entrainRef.current; // 1 => synced

      // Turbulence: high when restless, low when calm/entrained
      turbRef.current = lerp(1.35, 0.05, clamp(1 - rRestless + e * 0.8, 0, 1));

      const mul = speedMulRef.current;
      const turb = turbRef.current;
      const baseAlpha = baseAlphaRef.current;

      // Must match your other wavefront maxR
      const maxR = Math.hypot(w, h) * 0.6;
      const waveR = maxR * easeOut(wt);
      const hitWidth = 70;

      // Entrainment pulse: slow “breath-like” rhythm (visual metaphor)
      const pulseHz = 0.55;
      const pulse = Math.sin((time / 1000) * Math.PI * 2 * pulseHz) * 0.5 + 0.5; // 0..1

      for (const p of particles.current) {
        // Wave hit pushes particles outward (only during wave)
        if (!p.hit && wt > 0.001) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < waveR + hitWidth) p.applyWavePush(cx, cy);
        }

        // Reset hit if user scrolls back up before wave starts
        if (wt < 0.02) p.hit = false;

        p.update(w, h, mul, turb, time);

        // Alpha behavior:
        // - Restless: slightly noisier variance
        // - Entrainment: more coherent pulsing (subtle)
        const noisyVar = 0.75 + Math.random() * 0.45; // 0.75..1.2
        const coherent = 0.85 + 0.35 * pulse; // 0.85..1.2

        const alphaMul = lerp(noisyVar, coherent, e);
        const alpha = baseAlpha * alphaMul * (0.9 + 0.1 * (1 - rRestless));

        p.draw(ctx, alpha);
      }

      raf = requestAnimationFrame(loop);
    };

    if (reducedMotion) renderStatic();
    else raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
