"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import { NoiseLayer } from "./noise-layer";
import { IntrusiveThoughts } from "./intrusive-thoughts";
import { CalmRipples } from "./calm-ripples";
import { PitchController } from "./pitch-controller";
import { SectionSeparator } from "../section-separator";
import { SHARED } from "./pitch-flow.shared";

export function PitchFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const ambientT = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1) Toggle immersive class based on scrollYProgress
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const active = v > 0 && v < 1;
    document.body.classList.toggle("immersive", active);
  });

  // 2) Cleanup on unmount (route change / fast nav)
  useEffect(() => {
    return () => document.body.classList.remove("immersive");
  }, []);

  // Background deepens slightly through the whole pitch
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#0a0a20", "#040410"],
  );

  /**
   * MASTER TIMELINE (single continuous section)
   * 0.00–0.35: Restless mind (thoughts + noisy dots)
   * 0.35–0.60: Wave push moment (triggered by scroll, completes on its own)
   * 0.60–0.85: Entrainment explanation (same dots, now syncing)
   * 0.85–1.00: Bridge line / settle
   */

  /**
   * WAVE BEHAVIOR (ballistic)
   * - Scroll triggers the wave once you pass a point.
   * - Once triggered, it runs 0->1 at a fixed duration, independent of scroll.
   * - Optional: reset if user scrolls back up above the trigger region.
   */
  const waveT = useMotionValue(0);
  const waveHasPlayedRef = useRef(false);
  const waveControlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const triggerPoint = 0.35;

    // Trigger wave once
    if (!waveHasPlayedRef.current && v >= triggerPoint) {
      waveHasPlayedRef.current = true;

      waveControlsRef.current?.stop();
      waveT.set(0);

      // Plays to completion regardless of scrolling
      waveControlsRef.current = animate(waveT, 1, {
        duration: SHARED.WAVE_DURATION_S, // tune to match your calm ripple feel
        ease: "linear",
      });
    }

    // Optional: allow replay if user scrolls back up enough
    if (v < triggerPoint - 0.06 && waveHasPlayedRef.current) {
      waveHasPlayedRef.current = false;
      waveControlsRef.current?.stop();
      waveT.set(0);
    }
  });

  // Cleanup any running animation on unmount
  useEffect(() => {
    return () => {
      waveControlsRef.current?.stop();
    };
  }, []);

  /**
   * Phase driving:
   * Now that wave is autonomous, drive "restless" and "entrain" from waveT,
   * so visuals stay coherent regardless of scroll pauses.
   */

  // Restless (1) -> Calm (0) through the wave completion
  const restlessT = useTransform(waveT, [0, 0.9], [1, 0]);

  // Entrainment starts after wave has substantially progressed
  const entrainT = useTransform(waveT, [0.65, 1], [0, 1]);

  // Thoughts remain until shortly after wave begins; actual push-away is wavefront-based in the component
  const thoughtsOpacity = useTransform(waveT, [0, 0.25, 0.55], [1, 1, 0]);

  // Ripples visibility (keep the layer alive through the pitch)
  const waveOpacity = useTransform(scrollYProgress, [0.28, 0.36, 1], [0, 1, 1]);

  // Ambient calm ripples begin after the wave has moved well into calm
  const calmOpacity = useTransform(waveT, [0.55, 0.9], [0, 1]);

  return (
    <>
      <SectionSeparator variant="gradient" />
      <motion.section
        id="pitch-flow"
        ref={containerRef}
        style={{ backgroundColor }}
        className="relative h-[560vh] text-white"
        aria-label="Pitch flow: problem to solution"
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* DOT FIELD (persists across entire story; behavior changes by phase) */}
          <div className="absolute inset-0">
            <NoiseLayer
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={waveT as MotionValue<number>}
              restlessT={restlessT as MotionValue<number>}
              entrainT={entrainT as MotionValue<number>}
              ambientT={ambientT as MotionValue<number>}
            />
          </div>

          {/* INTRUSIVE THOUGHTS (only early + pushed by wavefront) */}
          <motion.div
            style={{ opacity: thoughtsOpacity }}
            className="absolute inset-0"
          >
            <IntrusiveThoughts
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={waveT as MotionValue<number>}
            />
          </motion.div>

          {/* RIPPLE LAYER (wavefront + ambient calm) */}
          <motion.div
            style={{ opacity: waveOpacity }}
            className="absolute inset-0"
          >
            <CalmRipples
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={waveT as MotionValue<number>}
              calmOpacity={calmOpacity as MotionValue<number>}
              ambientT={ambientT as MotionValue<number>}
            />
          </motion.div>

          {/* COPY CONTROLLER (beats for both parts) */}
          <PitchController
            scrollYProgress={scrollYProgress as MotionValue<number>}
          />
        </div>
      </motion.section>
    </>
  );
}
