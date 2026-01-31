"use client";

import { useEffect, useRef } from "react";
import {
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import {
  clamp,
  getCenter,
  getMaxWaveRadius,
  setupCanvasToViewport,
  waveRadiusProgress,
  SHARED,
} from "./pitch-flow.shared";

/**
 * =========================
 * TUNING CONTROLS (RIPPLES)
 * =========================
 */
const RIPPLES = {
  // Main wavefront stroke
  MAIN_LINE_WIDTH: 1,
  MAIN_ALPHA_MIN: 0.14,
  MAIN_ALPHA_FADE: 0.06,

  // Color
  CYAN_R: 160,
  CYAN_G: 220,
  CYAN_B: 255,

  // Ambient ripple behavior
  AMBIENT_ENABLED: true,

  /**
   * Constant spacing:
   * main-start -> first ambient == interval
   * ambient -> ambient == interval
   */
  AMBIENT_INTERVAL_MS: SHARED.WAVE_DURATION_S * 1000,

  // Ambient ripple stroke
  AMBIENT_LINE_WIDTH: 1,
  AMBIENT_ALPHA_MULT: 0.16,
};

type AmbientState = {
  startTime: number; // absolute ms timestamp
  durationMs: number;
  maxRadius: number;
};

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
    const ease = waveRadiusProgress(this.t);
    const radius = this.maxRadius * ease;
    const alpha = (1 - this.t) * RIPPLES.AMBIENT_ALPHA_MULT;

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${RIPPLES.CYAN_R}, ${RIPPLES.CYAN_G}, ${RIPPLES.CYAN_B}, ${alpha})`;
    ctx.lineWidth = RIPPLES.AMBIENT_LINE_WIDTH;
    ctx.stroke();
  }

  done() {
    return this.t >= 1;
  }
}

export function CalmRipples({
  scrollYProgress, // kept for API consistency
  waveT,
  calmOpacity,
  ambientT,
}: {
  scrollYProgress: MotionValue<number>;
  waveT: MotionValue<number>;
  calmOpacity: MotionValue<number>;
  ambientT: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Ripple[]>([]);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const waveTRef = useRef(0);
  const calmOpacityRef = useRef(0);

  // Single active ambient ripple state (drives ambientT for dots)
  const ambientRef = useRef<AmbientState | null>(null);

  useMotionValueEvent(waveT, "change", (v) => {
    waveTRef.current = clamp(v, 0, 1);
  });
  useMotionValueEvent(calmOpacity, "change", (v) => {
    calmOpacityRef.current = v;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      const size = setupCanvasToViewport(canvas, ctx);
      w = size.w;
      h = size.h;
    };

    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();

    // ---- Metronome state ----
    let metronomeArmed = false;
    let metronomeStartAt = 0; // when main wave started
    let nextTickAt = 0; // absolute time for next ambient spawn
    let prevWaveT = 0;
    let prevCalmOn = false;

    const durationMs = SHARED.WAVE_DURATION_S * 1000;

    const spawnAmbientAt = (tickTime: number) => {
      const { cx, cy } = getCenter(w, h);
      const maxRadius = getMaxWaveRadius(w, h);

      // Keep ONE visual ripple at a time for perfect dot sync
      ripples.current = [new Ripple(cx, cy, maxRadius, durationMs)];

      ambientRef.current = {
        startTime: tickTime,
        durationMs,
        maxRadius,
      };
      ambientT.set(0);
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const { cx, cy } = getCenter(w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${RIPPLES.CYAN_R}, ${RIPPLES.CYAN_G}, ${RIPPLES.CYAN_B}, 0.08)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const loop = (time: number) => {
      const dt = time - last;
      last = time;

      ctx.clearRect(0, 0, w, h);

      const { cx, cy } = getCenter(w, h);
      const maxR = getMaxWaveRadius(w, h);

      // 1) Draw main wavefront
      const tMain = waveTRef.current;
      if (tMain > 0.001) {
        const r = maxR * waveRadiusProgress(tMain);
        const alpha =
          (1 - tMain) * RIPPLES.MAIN_ALPHA_FADE + RIPPLES.MAIN_ALPHA_MIN;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RIPPLES.CYAN_R}, ${RIPPLES.CYAN_G}, ${RIPPLES.CYAN_B}, ${alpha})`;
        ctx.lineWidth = RIPPLES.MAIN_LINE_WIDTH;
        ctx.stroke();
      }

      // 2) Arm metronome exactly when main wave begins (rising edge)
      const eps = 0.001;
      const startedNow = prevWaveT <= eps && tMain > eps;
      prevWaveT = tMain;

      if (startedNow) {
        metronomeArmed = true;
        metronomeStartAt = time;
        nextTickAt = metronomeStartAt + RIPPLES.AMBIENT_INTERVAL_MS;
      }

      // If wave is rewound/reset to ~0, reset everything (you support replay)
      if (metronomeArmed && tMain <= eps) {
        metronomeArmed = false;
        metronomeStartAt = 0;
        nextTickAt = 0;
        prevCalmOn = false;

        ripples.current = [];
        ambientRef.current = null;
        ambientT.set(0);
      }

      // 3) Calm gating
      const calm = calmOpacityRef.current;
      const calmOn = RIPPLES.AMBIENT_ENABLED && calm > 0.15;

      // Key fix:
      // When calm turns ON, we realign nextTickAt so it is NEVER in the past.
      if (metronomeArmed && calmOn && !prevCalmOn) {
        const interval = RIPPLES.AMBIENT_INTERVAL_MS;
        const elapsed = time - metronomeStartAt;
        const k = Math.floor(elapsed / interval) + 1; // next tick strictly in future
        nextTickAt = metronomeStartAt + k * interval;
      }
      prevCalmOn = calmOn;

      // 4) Spawn ambient on schedule (no drift, no past-start bug)
      if (metronomeArmed && calmOn) {
        const hasActiveAmbient = !!ambientRef.current;

        if (!hasActiveAmbient && time >= nextTickAt) {
          // Use the scheduled tick time (very close to "time"), but never older than 1 frame.
          const tickTime = Math.max(nextTickAt, time - 16);
          spawnAmbientAt(tickTime);

          // Advance by exact interval (prevents jitter)
          nextTickAt += RIPPLES.AMBIENT_INTERVAL_MS;
        }
      }

      // 5) Drive ambientT for dots (0..1 while active)
      if (ambientRef.current) {
        const a = ambientRef.current;
        const t = clamp((time - a.startTime) / a.durationMs, 0, 1);
        ambientT.set(t);

        if (t >= 1) {
          ambientRef.current = null;
          ambientT.set(0);
        }
      }

      // Draw ambient visuals
      ripples.current.forEach((r) => {
        r.update(dt);
        r.draw(ctx);
      });
      ripples.current = ripples.current.filter((r) => !r.done());

      rafRef.current = requestAnimationFrame(loop);
    };

    if (reducedMotion) renderStatic();
    else rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, ambientT]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
