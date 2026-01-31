"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
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
 * TUNING CONTROLS (DOTS)
 * =========================
 */
const DOTS = {
  // Density
  DENSITY_MIN: 420,
  DENSITY_MAX: 820,

  // Dot size range
  SIZE_MIN: 0.6,
  SIZE_MAX: 1.8,

  // Base visibility
  ALPHA_BASE: 0.16,
  ALPHA_MIN: 0.06,
  ALPHA_MAX: 0.38,

  // Motion
  RESTLESS_TURB_MAX: 1.2,
  CALM_TURB_MIN: 0.05,
  SPEED_MUL_EARLY: 1.05,
  SPEED_MUL_LATE: 0.35,

  // Wave-hit ring
  HIT_BAND_PX: 28,
  HIT_TAIL_PX: 55,
  HIT_ALPHA_BOOST: 0.55,

  // Momentum + drift
  IMPULSE_DECAY: 0.86,
  DRIFT_DECAY: 0.985,
  DRIFT_FROM_PUSH: 0.03,
  DRIFT_MAX: 0.1,

  // Respawn rules
  RESPAWN_MARGIN_PX: 140,
  RESPAWN_RADIUS_PX: 220,
  RESPAWN_SPEED_BASE: 0.02,
  RESPAWN_SPEED_JITTER: 0.06,

  // Push effect
  PUSH_STRENGTH_MAIN: 0.06,
  PUSH_STRENGTH_AMBIENT: 0.03,

  // Only pulse while waves are actively travelling
  MAIN_WAVE_ACTIVE_FROM_T: 0.02,
  MAIN_WAVE_ACTIVE_TO_T: 0.98,

  AMBIENT_WAVE_ACTIVE_FROM_T: 0.02,
  AMBIENT_WAVE_ACTIVE_TO_T: 0.98,

  // Red color
  RED_R: 255,
  RED_G: 85,
  RED_B: 85,

  /**
   * ==============================
   * NEW: "POND PHYSICS" FEEL KNOBS
   * ==============================
   */

  // --- Push shaping (NEW) ---
  // Makes push strongest right before the wave hits, then drop quickly.
  PUSH_PREHIT_FALLOFF_POWER: 2.9, // higher = sharper peak near impact
  PUSH_PREHIT_MIN_SCALE: 0.08, // prevents totally zero push at the exact front
  PUSH_DISTANCE_SOFTEN_PX: 160, // reduces "snap" for dots close to center

  // How much the wave "steers" motion sideways along the wavefront.
  // 0 = pure radial outward push (old behavior)
  // 0.2–0.6 = feels like surface drift / swirl
  WAVE_TANGENTIAL_STEER: 0.95,

  // How stable the tangential direction is. Higher = more consistent swirl per dot.
  // (This is multiplied by each particle's spin (+1/-1))
  WAVE_TANGENTIAL_STEER_STABILITY: 1.0,

  // Prevent any "towards center" looking drift:
  // 0 = do nothing
  // 0.1–0.4 = gently damp inward component each frame
  INWARD_DAMPING: 0.22,
};

type Particle = {
  x: number;
  y: number;
  size: number;
  depth: number;
  vx: number;
  vy: number;
  ivx: number;
  ivy: number;

  dvx: number;
  dvy: number;

  respawnAt: number;
  bornAt: number;

  // NEW: clockwise/counterclockwise preference for tangential steering
  spin: 1 | -1;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function makeParticles(w: number, h: number) {
  const area = w * h;
  const approx = Math.floor(area / 5200);
  const count = clamp(approx, DOTS.DENSITY_MIN, DOTS.DENSITY_MAX);

  const arr: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const depth = r < 0.55 ? 0.6 : r < 0.88 ? 0.95 : 1.25;

    const size =
      (DOTS.SIZE_MIN + Math.random() * (DOTS.SIZE_MAX - DOTS.SIZE_MIN)) * depth;

    const baseV = (0.018 + Math.random() * 0.05) * depth;
    const dir = Math.random() * Math.PI * 2;

    arr.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size,
      depth,
      vx: Math.cos(dir) * baseV,
      vy: Math.sin(dir) * baseV,
      ivx: 0,
      ivy: 0,
      dvx: 0,
      dvy: 0,
      respawnAt: 0,
      bornAt: performance.now(),
      spin: Math.random() < 0.5 ? 1 : -1,
    });
  }
  return arr;
}

function respawnNearCenter(
  p: Particle,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const a = Math.random() * Math.PI * 2;
  const r = Math.random() * DOTS.RESPAWN_RADIUS_PX;

  p.x = cx + Math.cos(a) * r;
  p.y = cy + Math.sin(a) * r;

  p.ivx = 0;
  p.ivy = 0;

  // Keep drift outward-ish from center, but with some sideways bias
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const tx = -uy;
  const ty = ux;

  const outward =
    DOTS.RESPAWN_SPEED_BASE + Math.random() * DOTS.RESPAWN_SPEED_JITTER;

  const sideways = outward * 0.6 * p.spin;

  p.dvx = ux * outward + tx * sideways;
  p.dvy = uy * outward + ty * sideways;

  const dir = Math.random() * Math.PI * 2;
  const baseV =
    (DOTS.RESPAWN_SPEED_BASE + Math.random() * DOTS.RESPAWN_SPEED_JITTER) *
    p.depth;

  p.vx = Math.cos(dir) * baseV;
  p.vy = Math.sin(dir) * baseV;
}

/**
 * NEW applyWavePush:
 * - Adds radial outward impulse
 * - Adds tangential (sideways) impulse so dots "slide" along the wave
 * - Never creates a "pull toward center" sensation
 */
function applyWavePush(
  p: Particle,
  cx: number,
  cy: number,
  strengthMul: number,
) {
  if (strengthMul <= 0) return;

  const dx = p.x - cx;
  const dy = p.y - cy;

  const dist = Math.max(24, Math.hypot(dx, dy));
  const ux = dx / dist;
  const uy = dy / dist;

  // Tangent (perpendicular to radius)
  const tx = -uy;
  const ty = ux;

  // Base impulse (radial outward)
  const impulse = strengthMul * p.depth * 2.0;

  // Tangential steering (sideways slide)
  const steer =
    impulse *
    DOTS.WAVE_TANGENTIAL_STEER *
    DOTS.WAVE_TANGENTIAL_STEER_STABILITY *
    p.spin;

  // Apply: mostly outward, some sideways
  p.ivx += ux * impulse + tx * steer;
  p.ivy += uy * impulse + ty * steer;
}

function updateParticle(
  p: Particle,
  w: number,
  h: number,
  cx: number,
  cy: number,
  speedMul: number,
  turb: number,
  timeMs: number,
) {
  const nx = p.x / w;
  const ny = p.y / h;
  const t = timeMs * 0.00011;

  if (p.respawnAt !== 0 && timeMs >= p.respawnAt) {
    respawnNearCenter(p, w, h, cx, cy);
    p.bornAt = timeMs;
    p.respawnAt = 0;
  }

  const swirl =
    Math.sin((nx * 10 + t) * Math.PI * 2) *
    Math.cos((ny * 8 - t) * Math.PI * 2);

  const ax = Math.cos((ny * 7 + t) * Math.PI * 2) * turb * 0.05 * swirl;
  const ay = Math.sin((nx * 9 - t) * Math.PI * 2) * turb * 0.05 * swirl;

  p.vx += ax;
  p.vy += ay;

  const maxBase = 0.2 * p.depth;
  p.vx = clamp(p.vx, -maxBase, maxBase);
  p.vy = clamp(p.vy, -maxBase, maxBase);

  p.ivx *= DOTS.IMPULSE_DECAY;
  p.ivy *= DOTS.IMPULSE_DECAY;

  p.dvx *= DOTS.DRIFT_DECAY;
  p.dvy *= DOTS.DRIFT_DECAY;

  /**
   * NEW: gently damp "inward" component so nothing ever feels like it drifts into the origin.
   * We apply this to the *combined* long-term motion (base + drift).
   */
  if (DOTS.INWARD_DAMPING > 0) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / dist;
    const uy = dy / dist;

    // approximate current long-term velocity vector
    const vxLong = p.vx * speedMul + p.dvx;
    const vyLong = p.vy * speedMul + p.dvy;

    // radial component (positive = outward, negative = inward)
    const radial = vxLong * ux + vyLong * uy;

    if (radial < 0) {
      // remove a fraction of inward component
      const kill = -radial * DOTS.INWARD_DAMPING;
      p.vx += ux * kill * 0.5;
      p.vy += uy * kill * 0.5;
      p.dvx += ux * kill * 0.5;
      p.dvy += uy * kill * 0.5;
    }
  }

  p.x += p.vx * speedMul + p.ivx + p.dvx;
  p.y += p.vy * speedMul + p.ivy + p.dvy;

  const m = DOTS.RESPAWN_MARGIN_PX;
  if (p.x < -m || p.x > w + m || p.y < -m || p.y > h + m) {
    if (p.respawnAt === 0) {
      p.respawnAt = timeMs + 200 + Math.random() * 900;
    }
  }
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  alpha: number,
  redMix: number,
) {
  const r = Math.round(lerp(255, DOTS.RED_R, redMix));
  const g = Math.round(lerp(255, DOTS.RED_G, redMix));
  const b = Math.round(lerp(255, DOTS.RED_B, redMix));

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
  ctx.fill();
}

function applyWaveFront(
  p: Particle,
  dist: number,
  R: number,
  band: number,
  tail: number,
  pushStrength: number,
  cx: number,
  cy: number,
  driftFromPush: number,
  driftMax: number,
  pushScale = 1,
) {
  const diff = dist - R;

  // FRONT EDGE: wave is approaching (pre-hit) — strongest just before impact
  if (diff > 0 && diff < band) {
    // 0..1 where 1 = just about to hit (diff ~ band), 0 = at contact (diff ~ 0)
    const preHit01 = clamp(diff / band, 0, 1);

    // Shape: peak near 1, drop quickly toward 0
    const shaped = Math.pow(preHit01, DOTS.PUSH_PREHIT_FALLOFF_POWER);

    // Soften near the center (prevents "snap" on close particles)
    const centerSoft = clamp(dist / DOTS.PUSH_DISTANCE_SOFTEN_PX, 0, 1);

    // Final push multiplier
    const pushMul =
      pushScale * centerSoft * Math.max(DOTS.PUSH_PREHIT_MIN_SCALE, shaped);

    applyWavePush(p, cx, cy, pushStrength * pushMul);

    // Convert some impulse into drift (momentum continues after wave)
    p.dvx = clamp(p.dvx + p.ivx * driftFromPush, -driftMax, driftMax);
    p.dvy = clamp(p.dvy + p.ivy * driftFromPush, -driftMax, driftMax);

    // Full red at impact zone
    return 1;
  }

  // BACKSIDE: afterglow only (NO PUSH)
  if (diff <= 0 && diff > -tail) {
    const t = 1 - Math.abs(diff) / tail;
    return t;
  }

  return 0;
}

export function NoiseLayer({
  scrollYProgress,
  waveT,
  restlessT,
  entrainT,
  ambientT,
}: {
  scrollYProgress: MotionValue<number>;
  waveT: MotionValue<number>;
  restlessT: MotionValue<number>;
  entrainT: MotionValue<number>;
  ambientT: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  const waveTRef = useRef(0);
  const restlessRef = useRef(1);
  const entrainRef = useRef(0);
  const ambientTRef = useRef(0);

  const speedMulRef = useRef(DOTS.SPEED_MUL_EARLY);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = clamp(p, 0, 1);
    speedMulRef.current =
      DOTS.SPEED_MUL_EARLY +
      (DOTS.SPEED_MUL_LATE - DOTS.SPEED_MUL_EARLY) * clamp(t / 0.7, 0, 1);
  });

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
  useMotionValueEvent(
    ambientT,
    "change",
    (v) => (ambientTRef.current = clamp(v, 0, 1)),
  );

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
      particlesRef.current = makeParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particlesRef.current) drawDot(ctx, p, 0.12, 0);
    };

    const loop = (time: number) => {
      const dt = Math.min(0.033, (time - last) / 1000);
      last = time;

      ctx.clearRect(0, 0, w, h);

      const { cx, cy } = getCenter(w, h);
      const maxR = getMaxWaveRadius(w, h);

      const tMain = waveTRef.current;
      const mainActive =
        tMain > DOTS.MAIN_WAVE_ACTIVE_FROM_T &&
        tMain < DOTS.MAIN_WAVE_ACTIVE_TO_T;
      const mainR = maxR * waveRadiusProgress(tMain);

      const tAmb = ambientTRef.current;
      const ambActive =
        tAmb > DOTS.AMBIENT_WAVE_ACTIVE_FROM_T &&
        tAmb < DOTS.AMBIENT_WAVE_ACTIVE_TO_T;
      const ambR = maxR * waveRadiusProgress(tAmb);

      const restless = restlessRef.current;
      const calmReady = entrainRef.current;

      const turb = lerp(
        DOTS.RESTLESS_TURB_MAX,
        DOTS.CALM_TURB_MIN,
        clamp(1 - restless + calmReady, 0, 1),
      );

      const speedMul = speedMulRef.current;

      const band = DOTS.HIT_BAND_PX;
      const tail = DOTS.HIT_TAIL_PX;

      for (const p of particlesRef.current) {
        updateParticle(p, w, h, cx, cy, speedMul, turb, time);

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy);

        let redMix = 0;

        if (mainActive) {
          redMix = Math.max(
            redMix,
            applyWaveFront(
              p,
              dist,
              mainR,
              band,
              tail,
              DOTS.PUSH_STRENGTH_MAIN,
              cx,
              cy,
              DOTS.DRIFT_FROM_PUSH,
              DOTS.DRIFT_MAX,
            ),
          );
        }

        if (ambActive) {
          const distNorm = clamp(dist / maxR, 0, 1);
          const pushScale = 1 - distNorm * 0.6;

          redMix = Math.max(
            redMix,
            applyWaveFront(
              p,
              dist,
              ambR,
              band,
              tail,
              DOTS.PUSH_STRENGTH_AMBIENT,
              cx,
              cy,
              DOTS.DRIFT_FROM_PUSH,
              DOTS.DRIFT_MAX,
              pushScale,
            ),
          );
        }

        const baseAlpha = clamp(
          DOTS.ALPHA_BASE * (0.85 + 0.15 * p.depth),
          DOTS.ALPHA_MIN,
          DOTS.ALPHA_MAX,
        );

        const FADE_IN_MS = 450;
        const bornMul = clamp((time - p.bornAt) / FADE_IN_MS, 0, 1);

        const alpha = clamp(
          baseAlpha * (1 + redMix * DOTS.HIT_ALPHA_BOOST) * bornMul,
          0,
          DOTS.ALPHA_MAX,
        );

        drawDot(ctx, p, alpha, redMix);
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
