"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

export function PitchController({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();

  // Beat visibility
  const beatProblem = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.4],
    [1, 1, 0],
  );
  const beatHook = useTransform(scrollYProgress, [0.38, 0.55, 0.66], [0, 1, 0]);
  // ↑ only change here is the end from 0.70 -> 0.66 to create a gap

  // GAP: ~0.66 -> 0.72 (nothing visible)

  const beatHow = useTransform(scrollYProgress, [0.72, 0.82, 0.88], [0, 1, 0]);
  // GAP: ~0.88 -> 0.92 (nothing visible)

  const beatBridge = useTransform(
    scrollYProgress,
    [0.92, 0.97, 0.99],
    [0, 1, 1],
  );

  const letterSpacing = useTransform(
    scrollYProgress,
    [0, 1],
    ["-0.02em", "0.02em"],
  );
  const lineHeight = useTransform(scrollYProgress, [0, 1], [1.3, 1.5]);

  return (
    <div className="relative z-10 w-full max-w-3xl px-4 text-center">
      {/* Beat 1: Problem */}
      <motion.div
        style={{ opacity: reducedMotion ? 1 : beatProblem }}
        className="space-y-6"
      >
        <motion.h2
          style={reducedMotion ? undefined : { letterSpacing, lineHeight }}
          className="text-4xl md:text-5xl font-bold text-white text-balance"
        >
          Your mind doesn’t get a break anymore.
        </motion.h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Screens, stress, and constant input keep your nervous system in high
          gear — even when you’re tired. So when you finally lie down, your body
          stops… but your mind keeps running.
        </p>
      </motion.div>

      {/* Beat 2: Hook line (lands with the wave + calm shift) */}
      <motion.div
        style={{ opacity: reducedMotion ? 1 : beatHook }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p className="text-xl md:text-2xl font-medium text-slate-200 max-w-2xl">
          The fastest way to calm the mind is to give it a rhythm to follow.
        </p>
      </motion.div>

      {/* Beat 3: How it works (entrainment explanation) */}
      <motion.div
        style={{ opacity: reducedMotion ? 1 : beatHow }}
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
        style={{ opacity: reducedMotion ? 1 : beatBridge }}
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
