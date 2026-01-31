"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  type MotionValue,
  useMotionValue,
  animate,
  useMotionValueEvent,
} from "framer-motion";

type Beat = "problem" | "hook" | "how" | "bridge";

const BEATS: {
  key: Beat;
  // when scroll passes this point, this beat becomes "active"
  at: number;
}[] = [
  { key: "problem", at: 0.0 },
  { key: "hook", at: 0.38 },
  { key: "how", at: 0.72 },
  { key: "bridge", at: 0.92 },
];

// Tuning knobs for the feel
const COPY = {
  FADE_IN_S: 0.75,
  FADE_OUT_S: 0.5,
  EASE_IN: [0.16, 1, 0.3, 1] as const,
  EASE_OUT: [0.16, 1, 0.3, 1] as const,
};

function pickBeat(progress01: number): Beat {
  // pick the LAST threshold we have crossed
  let current: Beat = "problem";
  for (const b of BEATS) {
    if (progress01 >= b.at) current = b.key;
  }
  return current;
}

export function PitchController({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();

  // independent animated opacities (NOT scroll transforms)
  const opProblem = useMotionValue(1);
  const opHook = useMotionValue(0);
  const opHow = useMotionValue(0);
  const opBridge = useMotionValue(0);

  const controlsRef = useRef<ReturnType<typeof animate>[]>([]);
  const activeBeatRef = useRef<Beat>("problem");

  const map = useMemo(
    () => ({
      problem: opProblem,
      hook: opHook,
      how: opHow,
      bridge: opBridge,
    }),
    [opProblem, opHook, opHow, opBridge],
  );

  function stopAll() {
    controlsRef.current.forEach((c) => c.stop());
    controlsRef.current = [];
  }

  function setBeat(next: Beat) {
    if (activeBeatRef.current === next) return;
    activeBeatRef.current = next;

    stopAll();

    // animate all to target (one visible, others hidden)
    (Object.keys(map) as Beat[]).forEach((k) => {
      const mv = map[k];
      const target = k === next ? 1 : 0;

      // if reduced motion, snap immediately
      if (reducedMotion) {
        mv.set(target);
        return;
      }

      const isIn = target === 1;
      const c = animate(mv, target, {
        duration: isIn ? COPY.FADE_IN_S : COPY.FADE_OUT_S,
        ease: isIn ? COPY.EASE_IN : COPY.EASE_OUT,
      });
      controlsRef.current.push(c);
    });
  }

  // Initialize on mount (so refresh at mid-scroll still lands cleanly)
  useEffect(() => {
    const initial = pickBeat(scrollYProgress.get());
    activeBeatRef.current = initial;

    (Object.keys(map) as Beat[]).forEach((k) => {
      map[k].set(k === initial ? 1 : 0);
    });

    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only use scroll to choose beat boundaries, not to scrub opacity
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = pickBeat(v);
    setBeat(next);
  });

  return (
    <div className="relative z-10 w-full max-w-3xl px-4 text-center">
      {/* Beat 1: Problem */}
      <motion.div style={{ opacity: opProblem }} className="space-y-6">
        <motion.h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
          Your mind doesn’t get a break anymore.
        </motion.h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Screens, stress, and constant input keep your nervous system in high
          gear — even when you’re tired. So when you finally lie down, your body
          stops… but your mind keeps running.
        </p>
      </motion.div>

      {/* Beat 2: Hook */}
      <motion.div
        style={{ opacity: opHook }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p className="text-xl md:text-2xl font-medium text-slate-200 max-w-2xl">
          The fastest way to calm the mind is to give it a rhythm to follow.
        </p>
      </motion.div>

      {/* Beat 3: How */}
      <motion.div
        style={{ opacity: opHow }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-white">
            Your brain follows rhythm.
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Give the nervous system a steady signal, and it naturally starts to
            synchronize. ThetaMask uses soft, timed red light pulses designed to
            help you downshift into rest.
          </p>
          <p className="text-sm text-slate-400">
            This is brainwave entrainment — explained simply.
          </p>
        </div>
      </motion.div>

      {/* Beat 4: Bridge */}
      <motion.div
        style={{ opacity: opBridge }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="space-y-2">
          <p className="text-xl font-medium text-slate-200">
            Calm isn’t a switch. It’s a shift.
          </p>
          <p className="text-sm text-slate-400">
            Next: what ThetaMask looks like in real life.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
