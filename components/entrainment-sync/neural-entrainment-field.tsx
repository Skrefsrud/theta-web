"use client";

import { useEffect, useRef } from "react";
import {
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Node = {
  x: number;
  y: number;
  baseR: number;
  phase: number;       // current phase
  targetPhase: number; // used during lock-in
  drift: number;       // slight movement factor
};

export function NeuralEntrainmentField({
  sync,
  pulseOpacity,
}: {
  sync: MotionValue<number>; // 0..1 (smoothed)
  pulseOpacity: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  const nodesRef = useRef<Node[]>([]);
  const syncRef = useRef(0);
  const pulseOpacityRef = useRef(0);

  useMotionValueEvent(sync, "change", (v) => (syncRef.current = clamp(v, 0, 1)));
  useMotionValueEvent(pulseOpacity, "change", (v) => (pulseOpacityRef.current = clamp(v, 0, 1)));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rebuild = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const w = canvas.width;
      const h = canvas.height;

      // density tuned for perf
      const count = Math.min(520, Math.max(280, Math.floor((w * h) / 6500)));

      nodesRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        baseR: 0.8 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        targetPhase: 0,
        drift: 0.25 + Math.random() * 0.75,
      }));
    };

    rebuild();
    window.addEventListener("resize", rebuild);

    let raf = 0;
    let last = performance.now();

    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // static calm gradient-ish overlay feel (subtle)
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, w, h);

      nodesRef.current.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.baseR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.fill();
      });
    };

    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const s = syncRef.current;

      // Pulse speed: visually calm. This is NOT meant to match theta frequency literally.
      // It’s a calm visual metaphor.
      const pulseHzVisual = 0.6; // slow “breath-like” pulse
      const globalPhase = (t / 1000) * Math.PI * 2 * pulseHzVisual;

      // Draw a subtle central pulse ring to cue “rhythm”
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.42;

      const ringT = (Math.sin(globalPhase) * 0.5 + 0.5); // 0..1
      const ringR = maxR * (0.3 + 0.7 * ringT);
      const ringAlpha = (0.06 + 0.10 * ringT) * pulseOpacityRef.current;

      if (ringAlpha > 0.001) {
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(160, 220, 255, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Nodes: before sync -> random flicker
      // after sync -> phase-lock to globalPhase
      const lockStrength = s; // 0..1

      nodesRef.current.forEach((n) => {
        // tiny drift so it feels alive
        n.x += Math.sin(n.phase + globalPhase) * 6 * n.drift * dt * (1 - s * 0.7);
        n.y += Math.cos(n.phase + globalPhase) * 6 * n.drift * dt * (1 - s * 0.7);

        // wrap
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;

        // phase update:
        // - early: independent
        // - later: pulled toward global phase
        const freeSpeed = 2.4 + n.drift * 2.2; // lively early
        const lockedSpeed = 1.2;               // calmer later

        // a node’s “ideal” locked phase is globalPhase with a small spatial offset
        const dx = (n.x - cx) / w;
        const dy = (n.y - cy) / h;
        const spatialOffset = (dx + dy) * 1.6;

        n.targetPhase = globalPhase + spatialOffset;

        // interpolate its phase toward targetPhase as sync increases
        // (simple approach: blend phase velocity + tiny pull)
        const phaseVel = lerp(freeSpeed, lockedSpeed, lockStrength);
        n.phase += phaseVel * dt;

        // pull toward target phase (phase lock)
        const pull = 2.6 * lockStrength * dt;
        n.phase = lerp(n.phase, n.targetPhase, clamp(pull, 0, 1));

        // brightness:
        // early: random-ish shimmer
        // later: coherent shimmer
        const shimmer = lerp(
          Math.random(), // noisy
          (Math.sin(n.targetPhase) * 0.5 + 0.5), // coherent
          lockStrength
        );

        const alpha = lerp(0.06, 0.14, shimmer) * (0.85 + 0.15 * lockStrength);

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.baseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(loop);
    };

    if (reducedMotion) {
      renderStatic();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", rebuild);
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
