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
import { NoiseLayer } from "./noise-layer";
import { IntrusiveThoughts } from "./intrusive-thoughts";
import { CalmController } from "./calm-controller";
import { CalmRipples } from "./calm-ripples";
import { SectionSeparator } from "../section-separator";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function OverstimulationCalm() {
  const containerRef = useRef<HTMLDivElement>(null);
  useImmersiveBodyClass("calm-down");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#0a0a20", "#040410"],
  );

  // This is the raw scroll target (0..1)
  const waveTargetT = useTransform(scrollYProgress, [0.52, 0.72], [0, 1]);

  // This is what EVERYTHING uses (0..1), time-smoothed with max speed.
  const waveSmoothedT = useMotionValue(0);

  // Keep a ref to the latest target value
  const targetRef = useRef(0);
  useMotionValueEvent(waveTargetT, "change", (v) => {
    targetRef.current = clamp(v, 0, 1);
  });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    // Tune this to match your ambient ripple pace.
    // 0.30 => ~3.3s from 0→1
    const maxSpeed = 0.3;
    const retractSpeed = 0.5; // when scrolling back up

    const tick = (time: number) => {
      const dt = (time - last) / 1000;
      last = time;

      const cur = waveSmoothedT.get();
      const target = targetRef.current;

      if (target > cur) {
        waveSmoothedT.set(Math.min(target, cur + maxSpeed * dt));
      } else if (target < cur) {
        waveSmoothedT.set(Math.max(target, cur - retractSpeed * dt));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [waveSmoothedT]);

  const waveOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.62, 0.9],
    [0, 1, 1],
  );
  const calmOpacity = useTransform(scrollYProgress, [0.58, 0.78], [0, 1]);

  return (
    <>
      <SectionSeparator variant="gradient" />
      <motion.section
        id="calm-down"
        ref={containerRef}
        style={{ backgroundColor }}
        className="relative h-[300vh] text-white"
        aria-label="Overstimulation to Calm Transition"
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* Noisy world */}
          <div className="absolute inset-0">
            <NoiseLayer
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={waveSmoothedT as MotionValue<number>}
            />
          </div>

          <div className="absolute inset-0">
            <IntrusiveThoughts
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={waveSmoothedT as MotionValue<number>}
            />
          </div>

          {/* Calm world */}
          <motion.div
            style={{ opacity: waveOpacity }}
            className="absolute inset-0"
          >
            <CalmRipples
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={waveSmoothedT as MotionValue<number>}
              calmOpacity={calmOpacity as MotionValue<number>}
            />
          </motion.div>

          <CalmController
            scrollYProgress={scrollYProgress as MotionValue<number>}
          />
        </div>
      </motion.section>
    </>
  );
}

function useImmersiveBodyClass(sectionId: string) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("immersive", entry.isIntersecting);
      },
      {
        // Trigger when the section meaningfully occupies the viewport
        threshold: 0.25,
      },
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [sectionId]);
}
