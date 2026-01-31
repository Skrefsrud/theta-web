// components/pitch-flow/pitch-flow.shared.ts

export type WaveRadiusEasing = "linear" | "easeInOutCos";

export const SHARED: {
  CENTER_MODE: "screen";
  MAX_R_DIAGONAL_MULT: number; // used by ALL waves
  WAVE_RADIUS_EASING: WaveRadiusEasing; // used by ALL waves
  WAVE_DURATION_S: number;
} = {
  CENTER_MODE: "screen",
  MAX_R_DIAGONAL_MULT: 0.82, // reaches edges/corners on most screens
  WAVE_RADIUS_EASING: "easeInOutCos",
  WAVE_DURATION_S: 5.6,
};

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function easeInOutCos(t: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

// t01 (0..1) -> radius progress (0..1)
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

// DPR-safe canvas setup: draw in CSS pixels, render crisp.
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
