// calm-controller.tsx
"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export function CalmController({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();

  // Hold readability longer; fade out as transition starts
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45],
    [1, 1, 0],
  );

  // Bring hook earlier so it lands with ripples
  const hookOpacity = useTransform(scrollYProgress, [0.6, 0.75, 1], [0, 1, 1]);

  const letterSpacing = useTransform(
    scrollYProgress,
    [0, 1],
    ["-0.02em", "0.02em"],
  );
  const lineHeight = useTransform(scrollYProgress, [0, 1], [1.3, 1.5]);

  return (
    <div className="relative z-10 w-full max-w-2xl px-4 text-center">
      <motion.div
        style={{ opacity: reducedMotion ? 1 : contentOpacity }}
        className="space-y-6"
      >
        <motion.h2
          style={reducedMotion ? undefined : { letterSpacing, lineHeight }}
          className="text-4xl md:text-5xl font-bold text-white text-balance"
        >
          Your mind doesn’t get a break anymore.
        </motion.h2>

        <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
          Screens, stress, and constant input keep your nervous system in high
          gear — even when you’re tired. So when you finally lie down, your body
          stops… but your mind keeps running.
        </p>
      </motion.div>

      <motion.div
        style={{ opacity: reducedMotion ? 1 : hookOpacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p className="text-xl font-medium text-slate-200">
          The fastest way to calm the mind is to give it a rhythm to follow.
        </p>
      </motion.div>
    </div>
  );
}
