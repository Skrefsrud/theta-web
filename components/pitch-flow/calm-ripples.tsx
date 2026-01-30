// calm-ripples.tsx
"use client";

import { useEffect, useRef } from "react";
import {
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

class Ripple {
  x: number;
  y: number;
  t = 0;
  durationMs: number;
  maxRadius: number;

  constructor(x: number, y: number, maxRadius: number, durationMs: number) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.durationMs = durationMs;
  }

  update(dtMs: number) {
    this.t += dtMs / this.durationMs;
    if (this.t > 1) this.t = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const ease = 1 - Math.pow(1 - this.t, 2); // easeOut
    const radius = this.maxRadius * ease;
    const alpha = (1 - this.t) * 0.16;

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(160, 220, 255, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  done() {
    return this.t >= 1;
  }
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 2);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function CalmRipples({
  scrollYProgress, // kept for API consistency; not strictly required here
  waveT, // IMPORTANT: this is the already-smoothed wave (0..1)
  calmOpacity,
}: {
  scrollYProgress: MotionValue<number>;
  waveT: MotionValue<number>;
  calmOpacity: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Ripple[]>([]);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const waveTRef = useRef(0);
  const calmOpacityRef = useRef(0);

  useMotionValueEvent(
    waveT,
    "change",
    (v) => (waveTRef.current = clamp(v, 0, 1)),
  );
  useMotionValueEvent(
    calmOpacity,
    "change",
    (v) => (calmOpacityRef.current = v),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();

    // Ambient ripple spawn controls
    let nextSpawnIn = 3200; // ms
    let sinceSpawn = 0;

    const spawnAmbient = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Keep ambient centered for “still pond” vibe
      const x = w / 2;
      const y = h / 2;

      const maxRadius = Math.min(w, h) * (0.6 + Math.random() * 0.2);
      const duration = 4200 + Math.random() * 1800;

      ripples.current.push(new Ripple(x, y, maxRadius, duration));

      nextSpawnIn = 2800 + Math.random() * 2400;
      sinceSpawn = 0;
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(160, 220, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const loop = (time: number) => {
      const dt = time - last;
      last = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Must match NoiseLayer/Thoughts maxR for wave-hit sync
      const maxR = Math.hypot(w, h) * 0.6;

      // 1) Scroll-driven (smoothed) wavefront
      const t = waveTRef.current;
      if (t > 0.001) {
        const r = maxR * (0.5 - 0.5 * Math.cos(Math.PI * t));
        // Soft but readable line; fades a little as it expands
        const alpha = (1 - t) * 0.06 + 0.14;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(160, 220, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2) Ambient calm ripples (only after calm fades in)
      const calm = calmOpacityRef.current;
      if (calm > 0.15) {
        sinceSpawn += dt;
        if (sinceSpawn >= nextSpawnIn) spawnAmbient();
      } else {
        // Before calm: keep ambient empty so the scroll wave is the hero moment
        ripples.current = [];
      }

      ripples.current.forEach((r) => {
        r.update(dt);
        r.draw(ctx);
      });

      ripples.current = ripples.current.filter((r) => !r.done());

      rafRef.current = requestAnimationFrame(loop);
    };

    if (reducedMotion) {
      renderStatic();
    } else {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
