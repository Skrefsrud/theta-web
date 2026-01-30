"use client";

import { motion, useTransform, type MotionValue, useReducedMotion } from "framer-motion";

export function EntrainmentCopy({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();

  // 3 beats of copy
  const beat1 = useTransform(scrollYProgress, [0.0, 0.12, 0.30], [1, 1, 0]);
  const beat2 = useTransform(scrollYProgress, [0.18, 0.36, 0.55], [0, 1, 0]);
  const beat3 = useTransform(scrollYProgress, [0.48, 0.70, 1.0], [0, 1, 1]);

  const letterSpacing = useTransform(scrollYProgress, [0, 1], ["-0.02em", "0.02em"]);
  const lineHeight = useTransform(scrollYProgress, [0, 1], [1.3, 1.5]);

  return (
    <div className="relative z-10 w-full max-w-3xl px-4 text-center">
      <motion.div style={{ opacity: reducedMotion ? 1 : beat1 }} className="space-y-5">
        <motion.h2
          style={reducedMotion ? undefined : { letterSpacing, lineHeight }}
          className="text-4xl md:text-5xl font-bold text-white text-balance"
        >
          Your brain follows rhythm.
        </motion.h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Give the nervous system a steady pattern, and it naturally starts to synchronize —
          like a crowd clapping in time.
        </p>
      </motion.div>

      <motion.div style={{ opacity: reducedMotion ? 1 : beat2 }} className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-white">
            A gentle signal. A calmer pace.
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            ThetaMask uses soft, timed red light pulses designed to help your mind downshift —
            especially when it won’t “switch off” on its own.
          </p>
        </div>
      </motion.div>

      <motion.div style={{ opacity: reducedMotion ? 1 : beat3 }} className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-medium text-slate-200">
            This is brainwave entrainment — made wearable.
          </p>
          <p className="text-sm text-slate-400">
            Designed to feel subtle. Built to support rest.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
