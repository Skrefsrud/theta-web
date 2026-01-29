"use client";

import { motion, useTransform } from "framer-motion";

const content = [
  {
    title: "A Racing Mind at Bedtime?",
    description:
      "The day's thoughts spiral. Anxious energy keeps you from the rest you deserve. Sleep feels like a distant shore.",
    progress: [0, 0.25],
  },
  {
    title: "Introducing ThetaMask",
    description:
      "A new way to guide your mind to tranquility. No effort required.",
    progress: [0.3, 0.48],
  },
  {
    title: "The Rhythm of Red",
    description:
      "Gentle, rhythmic pulses of red light begin to calm the storm. This is brainwave entrainment.",
    progress: [0.5, 0.7],
  },
  {
    title: "Effortless Calm",
    description:
      "Your brainwaves synchronize with the calming rhythm, guiding you into a state of deep relaxation. Ready for sleep or meditation.",
    progress: [0.75, 1.0],
  },
];

export function StoryContent({ scrollYProgress }: { scrollYProgress: any }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
      {content.map((item, index) => {
        const opacity = useTransform(
          scrollYProgress,
          [
            item.progress[0],
            item.progress[0] + 0.05,
            item.progress[1] - 0.05,
            item.progress[1],
          ],
          [0, 1, 1, 0],
        );

        return (
          <motion.div
            key={index}
            style={{ opacity }}
            className="absolute max-w-2xl px-4 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance tracking-tight">
              {item.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
