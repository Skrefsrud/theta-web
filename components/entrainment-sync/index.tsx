"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { NeuralEntrainmentField } from "./neural-entrainment-field";
import { EntrainmentCopy } from "./entrainment-copy";
import { SectionSeparator } from "../section-separator";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

// Optional: reuse the same immersive body class trick if you want header hidden here too.
// If you already have this helper elsewhere, delete this and import it.
function useImmersiveBodyClass(sectionId: string) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("immersive", entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [sectionId]);
}

export function EntrainmentSync() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hide header during pitch sections (optional)
  useImmersiveBodyClass("entrainment");

  // Background subtly deepens
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#07081A", "#050513"],
  );

  // Raw target sync (0..1) from scroll
  const syncTarget = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);

  // Smooth it so it feels natural regardless of scroll speed
  const sync = useMotionValue(0);
  const syncTargetRef = useRef(0);

  useMotionValueEvent(syncTarget, "change", (v) => {
    syncTargetRef.current = clamp(v, 0, 1);
  });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    // Tune: how fast neurons “lock in”
    const maxSpeed = 0.28; // ~3.6s 0->1
    const retractSpeed = 0.45;

    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;

      const cur = sync.get();
      const target = syncTargetRef.current;

      if (target > cur) sync.set(Math.min(target, cur + maxSpeed * dt));
      else if (target < cur)
        sync.set(Math.max(target, cur - retractSpeed * dt));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sync]);

  // Pulse intensity rises as sync increases
  const pulseOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 1],
    [0, 1, 1],
  );

  return (
    <>
      <SectionSeparator variant="gradient" />
      <motion.section
        id="entrainment"
        ref={containerRef}
        style={{ backgroundColor }}
        className="relative h-[220vh] text-white"
        aria-label="How it works: brain follows rhythm"
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* Canvas visualization */}
          <div className="absolute inset-0">
            <NeuralEntrainmentField
              sync={sync as MotionValue<number>}
              pulseOpacity={pulseOpacity as MotionValue<number>}
            />
          </div>

          {/* Copy */}
          <EntrainmentCopy
            scrollYProgress={scrollYProgress as MotionValue<number>}
          />
        </div>
      </motion.section>
    </>
  );
}
