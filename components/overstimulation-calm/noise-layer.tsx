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

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  depth: number;

  // outward impulse that decays
  ivx = 0;
  ivy = 0;

  // whether wavefront already hit it
  hit = false;

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

    // subtle but visible push
    const strength = 0.9 + 1.4 * (1 - clamp(dist / 900, 0, 1));
    const impulse = strength * this.depth * 2.2;

    this.ivx += ux * impulse;
    this.ivy += uy * impulse;
    this.hit = true;
  }

  update(w: number, h: number, speedMul: number, turb: number, time: number) {
    // gentle turbulence for “busy mind”
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

    // decay impulse
    this.ivx *= 0.92;
    this.ivy *= 0.92;

    this.x += this.vx * speedMul + this.ivx;
    this.y += this.vy * speedMul + this.ivy;

    // wrap
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
}: {
  scrollYProgress: MotionValue<number>;
  waveT: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  const speedMulRef = useRef(1.0);
  const turbRef = useRef(1.0);
  const alphaRef = useRef(0.18);
  const waveTRef = useRef(0);

  useMotionValueEvent(waveT, "change", (v) => (waveTRef.current = v));

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = clamp(p / 0.65, 0, 1);
    speedMulRef.current = 1.35 + (0.3 - 1.35) * t;
    turbRef.current = 1.35 + (0.08 - 1.35) * t;
    alphaRef.current = 0.19 + (0.09 - 0.19) * t;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const build = () => {
      const w = canvas.width;
      const h = canvas.height;

      const count = Math.min(650, Math.max(380, Math.floor((w * h) / 5200)));
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        const depth = r < 0.55 ? 0.6 : r < 0.88 ? 0.95 : 1.25;
        arr.push(new Particle(w, h, depth));
      }
      particles.current = arr;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      build();
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;

    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => p.draw(ctx, 0.14));
    };

    const loop = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mul = speedMulRef.current;
      const turb = turbRef.current;
      const alpha = alphaRef.current;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Must match CalmRipples/Thoughts maxR
      const maxR = Math.hypot(w, h) * 0.6;
      const wt = clamp(waveTRef.current, 0, 1);
      const waveR = maxR * easeOut(wt);

      // When wave is active, push particles as the wavefront reaches them
      const hitWidth = 70;

      for (const p of particles.current) {
        if (!p.hit && wt > 0) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < waveR + hitWidth) {
            p.applyWavePush(cx, cy);
          }
        }

        p.update(w, h, mul, turb, time);
        p.draw(ctx, alpha);
      }

      // Reset hit flags if wave is reset (user scrolls back up)
      if (wt < 0.02) {
        for (const p of particles.current) p.hit = false;
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
