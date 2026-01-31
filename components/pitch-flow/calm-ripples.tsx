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
} from "./pitch-flow.shared";

/**
 * =========================
 * TUNING CONTROLS (RING)
 * =========================
 */
const RING = {
  CYAN_R: 160,
  CYAN_G: 220,
  CYAN_B: 255,

  // Ring look
  LINE_WIDTH: 1,
  ALPHA_MIN: 0.12,
  ALPHA_FADE: 0.08,

  // Keep ring subtle once calm is established
  CALM_ALPHA_MULT: 0.75,

  // Only show repeating rings once calm is “on”
  CALM_GATE: 0.15,
};

export function CalmRipples({
  waveClockT, // 0..1 progress for current wave
  waveIndex, // 1,2,3...
  waveActive, // 1 while travelling
  calmOpacity, // 0..1 from story wave
}: {
  waveClockT: MotionValue<number>;
  waveIndex: MotionValue<number>;
  waveActive: MotionValue<number>;
  calmOpacity: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const tRef = useRef(0);
  const idxRef = useRef(0);
  const activeRef = useRef(0);
  const calmRef = useRef(0);

  useMotionValueEvent(
    waveClockT,
    "change",
    (v) => (tRef.current = clamp(v, 0, 1)),
  );
  useMotionValueEvent(
    waveIndex,
    "change",
    (v) => (idxRef.current = Math.floor(v)),
  );
  useMotionValueEvent(waveActive, "change", (v) => (activeRef.current = v));
  useMotionValueEvent(calmOpacity, "change", (v) => (calmRef.current = v));

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

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const { cx, cy } = getCenter(w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${RING.CYAN_R}, ${RING.CYAN_G}, ${RING.CYAN_B}, 0.08)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      const { cx, cy } = getCenter(w, h);
      const maxR = getMaxWaveRadius(w, h);

      const t = tRef.current;
      const idx = idxRef.current;
      const active = activeRef.current > 0.5;
      const calm = calmRef.current;

      // We always show wave #1 (the “moment”).
      // For waves after that, only show once calm has faded in.
      const allowRepeat = calm > RING.CALM_GATE;
      const shouldDraw = active && (idx <= 1 || allowRepeat);

      if (shouldDraw) {
        const r = maxR * waveRadiusProgress(t);

        // Fade as it expands
        let alpha = (1 - t) * RING.ALPHA_FADE + RING.ALPHA_MIN;

        // Once calm is established, keep ring even more subtle
        if (idx >= 2) alpha *= RING.CALM_ALPHA_MULT;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RING.CYAN_R}, ${RING.CYAN_G}, ${RING.CYAN_B}, ${alpha})`;
        ctx.lineWidth = RING.LINE_WIDTH;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    if (reducedMotion) renderStatic();
    else rafRef.current = requestAnimationFrame(loop);

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
