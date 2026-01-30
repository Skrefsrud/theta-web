"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

const THOUGHTS = [
  "one more thing…",
  "did I reply?",
  "tomorrow…",
  "just check this…",
  "what if…",
  "don’t forget…",
];

const ANCHORS = [
  { x: 0.12, y: 0.18 },
  { x: 0.82, y: 0.22 },
  { x: 0.1, y: 0.55 },
  { x: 0.86, y: 0.58 },
  { x: 0.18, y: 0.78 },
  { x: 0.78, y: 0.82 },
];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 2);
}

export function IntrusiveThoughts({
  scrollYProgress,
  waveT,
}: {
  scrollYProgress: MotionValue<number>;
  waveT: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();
  const [vp, setVp] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const baseOpacity = useTransform(scrollYProgress, [0, 0.1], [0.65, 0.8]);

  const items = useMemo(() => {
    const w = vp.w;
    const h = vp.h;
    const cx = w / 2;
    const cy = h / 2;

    return THOUGHTS.slice(0, 6).map((text, i) => {
      const a = ANCHORS[i] ?? ANCHORS[0];
      const x = a.x * w;
      const y = a.y * h;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const ux = dx / dist;
      const uy = dy / dist;

      return { text, x, y, dist, ux, uy, i };
    });
  }, [vp.w, vp.h]);

  return (
    <motion.div className="absolute inset-0" aria-hidden="true">
      {items.map((t) => {
        // Compute wave radius from waveT
        // Must match CalmRipples maxR to sync perfectly:
        const maxR = Math.hypot(vp.w, vp.h) * 0.6;

        // hitWidth = how “thick” the wavefront feels.
        // Smaller = snappier push.
        const hitWidth = 90;

        // hit ramps up when wave radius passes thought distance
        const hit = useTransform(waveT, (wt) => {
          if (reducedMotion) return 0;
          const r = maxR * easeOut(clamp(wt, 0, 1));
          return clamp((r - t.dist) / hitWidth, 0, 1);
        });

        // Push strength: bigger for closer thoughts (feels physical)
        const strength = useTransform(hit, (h) => {
          const proximity = 1 - clamp(t.dist / 900, 0, 1);
          return (140 + 220 * proximity) * easeOut(h);
        });

        const xPush = useTransform(strength, (s) => t.ux * s);
        const yPush = useTransform(strength, (s) => t.uy * s);

        const fadeOut = useTransform(hit, [0, 0.35, 1], [1, 0.55, 0]);

        return (
          <motion.div
            key={t.text}
            className="absolute select-none"
            style={{
              left: t.x,
              top: t.y,
              filter: "blur(0.35px)",
              opacity: baseOpacity,
            }}
          >
            <motion.span
              className="text-sm tracking-wide text-slate-300/50"
              style={{
                x: xPush,
                y: yPush,
                opacity: fadeOut,
              }}
            >
              {t.text}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
