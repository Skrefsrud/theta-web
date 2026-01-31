// components/pitch-flow/pitch-flow.shared.ts

export type WaveRadiusEasing = "linear" | "easeInOutCos";

/**
 * =========================
 * SHARED TUNING CONTROLS
 * =========================
 * Keep these at the top so it’s obvious what changes what.
 */
export const SHARED = {
  // Geometry
  MAX_R_DIAGONAL_MULT: 0.82, // radius reaches screen corners
  WAVE_RADIUS_EASING: "easeInOutCos" as WaveRadiusEasing,

  // Timing
  WAVE_DURATION_S: 5.6, // how long each wave travels
  WAVE_INTERVAL_S: 5.6, // time between wave STARTS (set equal for back-to-back)
};

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function easeInOutCos(t: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1));
}

/**
 * Convert wave progress (0..1) to "radius progress" (0..1).
 * This MUST be used by both the ring and the dots to stay synced.
 */
export function waveRadiusProgress(t01: number) {
  const t = clamp(t01, 0, 1);
  return SHARED.WAVE_RADIUS_EASING === "linear" ? t : easeInOutCos(t);
}

export function getMaxWaveRadius(w: number, h: number) {
  return Math.hypot(w, h) * SHARED.MAX_R_DIAGONAL_MULT;
}

export function getCenter(w: number, h: number) {
  return { cx: w / 2, cy: h / 2 };
}

/**
 * DPR-safe canvas setup:
 * keeps drawing in CSS px while rendering crisp on retina.
 * Use this in BOTH canvases.
 */
export function setupCanvasToViewport(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);

  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { w: cssW, h: cssH, dpr };
}
