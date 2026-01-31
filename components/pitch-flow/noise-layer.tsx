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
  DENSITY_MIN: 2820,
  DENSITY_MAX: 3200,

  // Dot size range
  SIZE_MIN: 0.55,
  SIZE_MAX: 1.9,

  // Base visibility
  ALPHA_BASE: 0.16,
  ALPHA_MIN: 0.06,
  ALPHA_MAX: 0.42,

  // Motion
  RESTLESS_TURB_MAX: 1.25,
  CALM_TURB_MIN: 0.02,
  SPEED_MUL_EARLY: 1.05,
  SPEED_MUL_LATE: 0.35,

  // Wave-hit ring (how thick the “interaction zone” is)
  HIT_BAND_PX: 48,
  HIT_TAIL_PX: 75,
  HIT_ALPHA_BOOST: 0.55,

  // Momentum + drift
  IMPULSE_DECAY: 0.86,
  DRIFT_DECAY: 0.995,
  DRIFT_FROM_PUSH: 0.03,
  DRIFT_MAX: 0.1,

  // Push effect (overall strength)
  PUSH_STRENGTH: 0.025,

  // “Lift” on impact (size bump)
  HIT_SIZE_BOOST: 0.8,

  // Size lift curve (fast up, slower down)
  HIT_LIFT_ATTACK: 0.55,
  HIT_LIFT_RELEASE: 5.8,

  // Only react while waves are travelling
  MAIN_WAVE_ACTIVE_FROM_T: 0.02,
  MAIN_WAVE_ACTIVE_TO_T: 0.98,
  AMBIENT_WAVE_ACTIVE_FROM_T: 0.02,
  AMBIENT_WAVE_ACTIVE_TO_T: 0.98,

  // How much chaos remains after the first wave (0 = fully organized, 1 = unchanged)
  POST_WAVE_CHAOS_MUL: 0.2,

  // During an active wave-hit, how hard we damp existing velocity (bigger = more “fluid reset”)
  WAVE_VELOCITY_DAMP: 0.92,

  // How strongly we align dots to outward flow after the first wave (0..1)
  OUTFLOW_ALIGN: 0.85,

  // Extra outward “current” added after the first wave (scaled by size/depth below)
  OUTFLOW_SPEED: 0.08,

  // Color (you made it “no red” by setting it white)
  RED_R: 255,
  RED_G: 255,
  RED_B: 255,

  /**
   * ==============================
   * POND PHYSICS FEEL (STEERING)
   * ==============================
   */
  PUSH_PREHIT_FALLOFF_POWER: 2.9,
  PUSH_PREHIT_MIN_SCALE: 0.08,
  PUSH_DISTANCE_SOFTEN_PX: 160,

  WAVE_TANGENTIAL_STEER: 0.35,
  WAVE_TANGENTIAL_STEER_STABILITY: 1.0,

  INWARD_DAMPING: 0.22,

  /**
   * ======================================
   * OUTER RECYCLER (stable outward flow)
   * ======================================
   */
  FADE_OUT_RADIUS_MULT: 0.92,
  KILL_RADIUS_MULT: 1.06,

  RESPAWN_RADIUS_PX: 340,
  FADE_IN_MS: 520,
  RECYCLE_FADE_MS: 420,

  /**
   * ==========================================
   * CENTER DENSITY GOVERNOR (Option C)
   * ==========================================
   */
  CENTER_RADIUS_MULT: 0.28,
  CENTER_TARGET_FRAC: 0.22,
  CENTER_CHECK_EVERY_MS: 180,
  CENTER_RECYCLE_MAX_PER_CHECK: 6,
  CENTER_RECYCLE_MIN_DIST_MULT: 0.75,
};

type Particle = {
  x: number;
  y: number;
  size: number;
  depth: number;

  vx: number;
  vy: number;

  // short-lived wave impulse
  ivx: number;
  ivy: number;

  // long-term drift (outward-ish)
  dvx: number;
  dvy: number;

  bornAt: number;

  // tangential preference
  spin: 1 | -1;

  // recycling fade window (0 = not recycling)
  recycleStart: number;
  recycleEnd: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function makeParticles(w: number, h: number) {
  const area = w * h;
  const approx = Math.floor(area / 5200);
  const count = clamp(approx, DOTS.DENSITY_MIN, DOTS.DENSITY_MAX);

  const arr: Particle[] = [];
  const now = performance.now();

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const depth = r < 0.55 ? 0.6 : r < 0.88 ? 0.95 : 1.25;

    const size =
      (DOTS.SIZE_MIN + Math.random() * (DOTS.SIZE_MAX - DOTS.SIZE_MIN)) * depth;

    const baseV = (0.012 + Math.random() * 0.03) * depth;
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
      bornAt: now,
      spin: Math.random() < 0.5 ? 1 : -1,
      recycleStart: 0,
      recycleEnd: 0,
    });
  }

  return arr;
}

function respawnNearCenter(
  p: Particle,
  cx: number,
  cy: number,
  timeMs: number,
) {
  const a = Math.random() * Math.PI * 2;
  const r = Math.random() * DOTS.RESPAWN_RADIUS_PX;

  p.x = cx + Math.cos(a) * r;
  p.y = cy + Math.sin(a) * r;

  p.ivx = 0;
  p.ivy = 0;

  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const tx = -uy;
  const ty = ux;

  const outward = (0.012 + Math.random() * 0.03) * (1 / p.depth);
  const sideways = outward * 0.6 * p.spin;

  p.dvx = ux * outward + tx * sideways;
  p.dvy = uy * outward + ty * sideways;

  const dir = Math.random() * Math.PI * 2;
  const baseV = (0.008 + Math.random() * 0.03) * (1 / p.depth);
  p.vx = Math.cos(dir) * baseV;
  p.vy = Math.sin(dir) * baseV;

  p.bornAt = timeMs;
  p.recycleStart = 0;
  p.recycleEnd = 0;
}

function startRecycle(p: Particle, timeMs: number) {
  if (p.recycleStart !== 0) return;
  p.recycleStart = timeMs;
  p.recycleEnd = timeMs + DOTS.RECYCLE_FADE_MS;
}

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

  const tx = -uy;
  const ty = ux;

  const impulse = strengthMul * (1 / p.depth) * 1.6;
  const steer =
    impulse *
    DOTS.WAVE_TANGENTIAL_STEER *
    DOTS.WAVE_TANGENTIAL_STEER_STABILITY *
    p.spin;

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
  if (p.recycleEnd !== 0 && timeMs >= p.recycleEnd) {
    respawnNearCenter(p, cx, cy, timeMs);
  }

  const fadingOut = p.recycleStart !== 0 && timeMs < p.recycleEnd;

  const nx = p.x / w;
  const ny = p.y / h;
  const t = timeMs * 0.00011;

  const swirl =
    Math.sin((nx * 10 + t) * Math.PI * 2) *
    Math.cos((ny * 8 - t) * Math.PI * 2);

  const ax = Math.cos((ny * 7 + t) * Math.PI * 2) * turb * 0.05 * swirl;
  const ay = Math.sin((nx * 9 - t) * Math.PI * 2) * turb * 0.05 * swirl;

  p.vx += ax;
  p.vy += ay;

  const maxBase = 0.2 * (1 / p.depth);
  p.vx = clamp(p.vx, -maxBase, maxBase);
  p.vy = clamp(p.vy, -maxBase, maxBase);

  p.ivx *= DOTS.IMPULSE_DECAY;
  p.ivy *= DOTS.IMPULSE_DECAY;

  p.dvx *= DOTS.DRIFT_DECAY;
  p.dvy *= DOTS.DRIFT_DECAY;

  if (DOTS.INWARD_DAMPING > 0) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / dist;
    const uy = dy / dist;

    const vxLong = p.vx * speedMul + p.dvx;
    const vyLong = p.vy * speedMul + p.dvy;

    const radial = vxLong * ux + vyLong * uy;

    if (radial < 0) {
      const kill = -radial * DOTS.INWARD_DAMPING;
      p.vx += ux * kill * 0.5;
      p.vy += uy * kill * 0.5;
      p.dvx += ux * kill * 0.5;
      p.dvy += uy * kill * 0.5;
    }
  }

  const localSpeed = fadingOut ? speedMul * 0.35 : speedMul;

  p.x += p.vx * localSpeed + p.ivx + p.dvx;
  p.y += p.vy * localSpeed + p.ivy + p.dvy;
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  alpha: number,
  redMix: number,
  sizeMul: number,
) {
  const r = Math.round(lerp(255, DOTS.RED_R, redMix));
  const g = Math.round(lerp(255, DOTS.RED_G, redMix));
  const b = Math.round(lerp(255, DOTS.RED_B, redMix));

  const radius = p.size * sizeMul;

  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
  ctx.fill();
}

/**
 * Wavefront interaction:
 * Returns BOTH:
 * - red: visual highlight
 * - lift: size bump profile (fast up, slower down)
 */
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

  // FRONT (approaching): lift ramps up toward impact
  if (diff > 0 && diff < band) {
    // 0 at band edge (first contact), 1 right at impact
    const approach01 = clamp(1 - diff / band, 0, 1);

    const shaped = Math.pow(approach01, DOTS.PUSH_PREHIT_FALLOFF_POWER);
    const centerSoft = clamp(dist / DOTS.PUSH_DISTANCE_SOFTEN_PX, 0, 1);

    const pushMul =
      pushScale * centerSoft * Math.max(DOTS.PUSH_PREHIT_MIN_SCALE, shaped);

    applyWavePush(p, cx, cy, pushStrength * pushMul);

    p.dvx = clamp(p.dvx + p.ivx * driftFromPush, -driftMax, driftMax);
    p.dvy = clamp(p.dvy + p.ivy * driftFromPush, -driftMax, driftMax);

    const lift = Math.pow(approach01, DOTS.HIT_LIFT_ATTACK);

    return { red: 1, lift };
  }

  // BACKSIDE (afterglow)
  if (diff <= 0 && diff > -tail) {
    const t01 = 1 - Math.abs(diff) / tail;
    const lift = Math.pow(t01, 1 / DOTS.HIT_LIFT_RELEASE);
    return { red: t01, lift };
  }

  return { red: 0, lift: 0 };
}

export function NoiseLayer({
  scrollYProgress,
  storyWaveT,
  waveClockT,
  waveIndex,
  restlessT,
  entrainT,
}: {
  scrollYProgress: MotionValue<number>;
  storyWaveT: MotionValue<number>;
  waveClockT: MotionValue<number>;
  waveIndex: MotionValue<number>;
  restlessT: MotionValue<number>;
  entrainT: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  const storyWaveTRef = useRef(0);
  const waveClockTRef = useRef(0);
  const waveIndexRef = useRef(0);

  const restlessRef = useRef(1);
  const entrainRef = useRef(0);

  const speedMulRef = useRef(DOTS.SPEED_MUL_EARLY);
  const lastCenterCheckRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = clamp(p, 0, 1);
    speedMulRef.current =
      DOTS.SPEED_MUL_EARLY +
      (DOTS.SPEED_MUL_LATE - DOTS.SPEED_MUL_EARLY) * clamp(t / 0.7, 0, 1);
  });

  useMotionValueEvent(storyWaveT, "change", (v) => {
    storyWaveTRef.current = clamp(v, 0, 1);
  });

  useMotionValueEvent(waveClockT, "change", (v) => {
    waveClockTRef.current = clamp(v, 0, 1);
  });

  useMotionValueEvent(waveIndex, "change", (v) => {
    waveIndexRef.current = Math.max(0, Math.floor(v));
  });

  useMotionValueEvent(restlessT, "change", (v) => {
    restlessRef.current = clamp(v, 0, 1);
  });

  useMotionValueEvent(entrainT, "change", (v) => {
    entrainRef.current = clamp(v, 0, 1);
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
      particlesRef.current = makeParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particlesRef.current) drawDot(ctx, p, 0.12, 0, 1);
    };

    const loop = (time: number) => {
      const dt = Math.min(0.033, (time - last) / 1000);
      last = time;

      ctx.clearRect(0, 0, w, h);

      const { cx, cy } = getCenter(w, h);
      const maxR = getMaxWaveRadius(w, h);

      const fadeStartR = maxR * DOTS.FADE_OUT_RADIUS_MULT;
      const killR = maxR * DOTS.KILL_RADIUS_MULT;

      const tWave = waveClockTRef.current;

      const waveActive =
        tWave > DOTS.MAIN_WAVE_ACTIVE_FROM_T &&
        tWave < DOTS.MAIN_WAVE_ACTIVE_TO_T;

      const waveR = maxR * waveRadiusProgress(tWave);

      const restless = restlessRef.current;
      const calmReady = entrainRef.current;

      const turb = lerp(
        DOTS.RESTLESS_TURB_MAX,
        DOTS.CALM_TURB_MIN,
        clamp(1 - restless + calmReady, 0, 1),
      );

      const storyT = storyWaveTRef.current; // 0..1

      // 1 early -> POST_WAVE_CHAOS_MUL late
      const chaosMul = 1 - (1 - DOTS.POST_WAVE_CHAOS_MUL) * clamp(storyT, 0, 1);
      const turbEffective = turb * chaosMul;

      const speedMul = speedMulRef.current;

      const band = DOTS.HIT_BAND_PX;
      const tail = DOTS.HIT_TAIL_PX;

      /**
       * CENTER DENSITY GOVERNOR
       */
      if (time - lastCenterCheckRef.current >= DOTS.CENTER_CHECK_EVERY_MS) {
        lastCenterCheckRef.current = time;

        const centerR = maxR * DOTS.CENTER_RADIUS_MULT;
        const total = particlesRef.current.length;
        const target = Math.floor(total * DOTS.CENTER_TARGET_FRAC);

        let centerCount = 0;
        for (const p of particlesRef.current) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d = Math.hypot(dx, dy);
          if (d <= centerR) centerCount++;
        }

        const deficit = target - centerCount;
        if (deficit > 0) {
          const canPull = Math.min(deficit, DOTS.CENTER_RECYCLE_MAX_PER_CHECK);

          const candidates: { p: Particle; dist: number }[] = [];
          const minDist = maxR * DOTS.CENTER_RECYCLE_MIN_DIST_MULT;

          for (const p of particlesRef.current) {
            if (p.recycleStart !== 0) continue;
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d = Math.hypot(dx, dy);
            if (d >= minDist) candidates.push({ p, dist: d });
          }

          candidates.sort((a, b) => b.dist - a.dist);

          for (let i = 0; i < canPull && i < candidates.length; i++) {
            startRecycle(candidates[i].p, time);
          }
        }
      }

      for (const p of particlesRef.current) {
        updateParticle(p, w, h, cx, cy, speedMul, turbEffective, time);

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy);

        // Outer recycler
        if (dist >= killR) startRecycle(p, time);

        const canReact = p.recycleStart === 0;

        let redMix = 0;
        let liftMix = 0;

        if (canReact && waveActive) {
          const distNorm = clamp(dist / maxR, 0, 1);
          const pushScale = 1 - distNorm * 0.6;

          const hit = applyWaveFront(
            p,
            dist,
            waveR,
            band,
            tail,
            DOTS.PUSH_STRENGTH,
            cx,
            cy,
            DOTS.DRIFT_FROM_PUSH,
            DOTS.DRIFT_MAX,
            pushScale,
          );

          redMix = Math.max(redMix, hit.red);
          liftMix = Math.max(liftMix, hit.lift);

          // ✅ NEW: wave overrides old trajectory during impact
          const damp = DOTS.WAVE_VELOCITY_DAMP * hit.lift;
          if (damp > 0) {
            const k = clamp(1 - damp, 0, 1);
            p.vx *= k;
            p.vy *= k;
            p.dvx *= k;
            p.dvy *= k;
          }
        }

        // ✅ NEW: after the first wave, gradually align to outward current
        if (storyT > 0.02) {
          const ux = dx / Math.max(1, dist);
          const uy = dy / Math.max(1, dist);

          const heavy = 1 / p.depth; // heavier dots move slower
          const targetVx = ux * DOTS.OUTFLOW_SPEED * heavy;
          const targetVy = uy * DOTS.OUTFLOW_SPEED * heavy;

          const a = DOTS.OUTFLOW_ALIGN * clamp(storyT, 0, 1);

          p.dvx = lerp(p.dvx, targetVx, a);
          p.dvy = lerp(p.dvy, targetVy, a);
        }

        const baseAlpha = clamp(
          DOTS.ALPHA_BASE * (0.85 + 0.15 * (1 / p.depth)),
          DOTS.ALPHA_MIN,
          DOTS.ALPHA_MAX,
        );

        const bornMul = clamp((time - p.bornAt) / DOTS.FADE_IN_MS, 0, 1);

        let outerMul = 1;
        if (dist > fadeStartR) {
          outerMul = clamp(
            1 - (dist - fadeStartR) / (killR - fadeStartR),
            0,
            1,
          );
        }

        let recycleMul = 1;
        if (p.recycleStart !== 0 && time < p.recycleEnd) {
          recycleMul = clamp(
            1 - (time - p.recycleStart) / DOTS.RECYCLE_FADE_MS,
            0,
            1,
          );
        }

        const alpha = clamp(
          baseAlpha *
            (1 + redMix * DOTS.HIT_ALPHA_BOOST) *
            bornMul *
            outerMul *
            recycleMul,
          0,
          DOTS.ALPHA_MAX,
        );

        // size driven by liftMix
        const sizeMul = 1 + liftMix * DOTS.HIT_SIZE_BOOST;

        drawDot(ctx, p, alpha, redMix, sizeMul);
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
