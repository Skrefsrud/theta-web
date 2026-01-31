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
import { SHARED, clamp } from "./pitch-flow.shared";

export function PitchFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Immersive toggle
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const active = v > 0 && v < 1;
    document.body.classList.toggle("immersive", active);
  });

  useEffect(() => {
    return () => document.body.classList.remove("immersive");
  }, []);

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#0a0a20", "#040410"],
  );

  /**
   * =========================
   * STORY WAVE (narrative)
   * =========================
   * This runs ONCE (scroll-triggered) and drives the phase text / calm transition.
   */
  const storyWaveT = useMotionValue(0);
  const storyHasPlayedRef = useRef(false);
  const storyControlsRef = useRef<ReturnType<typeof animate> | null>(null);

  /**
   * =========================
   * WAVE CLOCK (visual truth)
   * =========================
   * Single shared wave that:
   * - starts when story wave starts
   * - then runs on a fixed metronome interval
   * - used by BOTH ring + dots so they always stay synced.
   */
  const waveClockT = useMotionValue(0); // 0..1 for current wave (0 when idle)
  const waveIndex = useMotionValue(0); // increments each wave start
  const waveActive = useMotionValue(0); // 1 when a wave is travelling, else 0

  const metronome = useRef({
    armed: false,
    currentStart: 0,
    nextStart: 0,
    intervalMs: SHARED.WAVE_INTERVAL_S * 1000,
    durationMs: SHARED.WAVE_DURATION_S * 1000,
    lastTime: 0,
  });

  // Start story wave on scroll
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const triggerPoint = 0.35;

    if (!storyHasPlayedRef.current && v >= triggerPoint) {
      storyHasPlayedRef.current = true;

      // 1) Story wave animation (phases)
      storyControlsRef.current?.stop();
      storyWaveT.set(0);
      storyControlsRef.current = animate(storyWaveT, 1, {
        duration: SHARED.WAVE_DURATION_S,
        ease: "linear",
      });

      // 2) Arm metronome + start wave #1 NOW (same moment)
      const now = performance.now();
      metronome.current.armed = true;
      metronome.current.currentStart = now;
      metronome.current.nextStart = now + metronome.current.intervalMs;
      metronome.current.lastTime = now;

      waveIndex.set(1);
      waveActive.set(1);
      waveClockT.set(0);
    }

    // Optional replay if scrolling back up
    if (v < triggerPoint - 0.06 && storyHasPlayedRef.current) {
      storyHasPlayedRef.current = false;
      storyControlsRef.current?.stop();
      storyWaveT.set(0);

      metronome.current.armed = false;
      waveIndex.set(0);
      waveActive.set(0);
      waveClockT.set(0);
    }
  });

  // Drive WaveClock on RAF (stable timing)
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      const m = metronome.current;

      if (m.armed) {
        // Start next wave(s) exactly on schedule (no drift)
        while (now >= m.nextStart) {
          m.currentStart = m.nextStart;
          m.nextStart += m.intervalMs;
          waveIndex.set(waveIndex.get() + 1);
        }

        // Progress within current wave
        const t = clamp((now - m.currentStart) / m.durationMs, 0, 1);
        waveClockT.set(t);

        // Active only while travelling
        waveActive.set(t > 0 && t < 1 ? 1 : 0);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [waveClockT, waveIndex, waveActive]);

  // Cleanup
  useEffect(() => {
    return () => storyControlsRef.current?.stop();
  }, []);

  /**
   * =========================
   * Phase driving (story)
   * =========================
   */
  const restlessT = useTransform(storyWaveT, [0, 0.9], [1, 0]);
  const entrainT = useTransform(storyWaveT, [0.65, 1], [0, 1]);
  const thoughtsOpacity = useTransform(storyWaveT, [0, 0.25, 0.55], [1, 1, 0]);

  const waveOpacity = useTransform(scrollYProgress, [0.28, 0.36, 1], [0, 1, 1]);
  const calmOpacity = useTransform(storyWaveT, [0.55, 0.9], [0, 1]);

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
          {/* DOT FIELD */}
          <div className="absolute inset-0">
            <NoiseLayer
              scrollYProgress={scrollYProgress as MotionValue<number>}
              storyWaveT={storyWaveT as MotionValue<number>}
              waveClockT={waveClockT as MotionValue<number>}
              waveIndex={waveIndex as MotionValue<number>}
              restlessT={restlessT as MotionValue<number>}
              entrainT={entrainT as MotionValue<number>}
            />
          </div>

          {/* THOUGHTS */}
          <motion.div
            style={{ opacity: thoughtsOpacity }}
            className="absolute inset-0"
          >
            <IntrusiveThoughts
              scrollYProgress={scrollYProgress as MotionValue<number>}
              waveT={storyWaveT as MotionValue<number>}
            />
          </motion.div>

          {/* RING LAYER */}
          <motion.div
            style={{ opacity: waveOpacity }}
            className="absolute inset-0"
          >
            <CalmRipples
              waveClockT={waveClockT as MotionValue<number>}
              waveIndex={waveIndex as MotionValue<number>}
              calmOpacity={calmOpacity as MotionValue<number>}
              waveActive={waveActive as MotionValue<number>}
            />
          </motion.div>

          {/* COPY */}
          <PitchController
            scrollYProgress={scrollYProgress as MotionValue<number>}
          />
        </div>
      </motion.section>
    </>
  );
}
