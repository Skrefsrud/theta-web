"use client";

import { motion } from "framer-motion";

interface SectionSeparatorProps {
  variant?: "wave" | "glow" | "gradient";
}

export function SectionSeparator({ variant = "glow" }: SectionSeparatorProps) {
  if (variant === "wave") {
    return (
      <div className="relative w-full h-16 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                stopColor="rgb(6, 182, 212)"
                stopOpacity="0.3"
              />
              <stop
                offset="50%"
                stopColor="rgb(168, 85, 247)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="rgb(6, 182, 212)"
                stopOpacity="0.3"
              />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,60 C300,100 600,20 900,60 C1050,80 1200,60 1200,60 L1200,120 L0,120 Z"
            fill="url(#waveGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
        </svg>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <motion.div
        className="relative w-full h-px overflow-hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
      </motion.div>
    );
  }

  // Default: glow variant
  return (
    <motion.div
      className="relative w-full h-24 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Glowing line */}
      <motion.div
        className="absolute w-full h-[2px]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </motion.div>

      {/* Blur glow effect */}
      <motion.div
        className="absolute w-full h-8 blur-xl"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </motion.div>

      {/* Decorative dots */}
      <motion.div
        className="absolute flex gap-2"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        viewport={{ once: true }}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
      </motion.div>
    </motion.div>
  );
}
