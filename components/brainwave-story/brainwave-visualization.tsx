"use client";

import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { ChaoticParticles } from "./chaotic-particles";

export function BrainwaveVisualization({
  scrollYProgress,
}: {
  scrollYProgress: any;
}) {
  const maskOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const maskScale = useTransform(scrollYProgress, [0.2, 0.3], [0.8, 1]);
  const maskY = useTransform(scrollYProgress, [0.2, 1], ["0%", "-50%"]);

  const pulseOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.8, 0.9],
    [0, 1, 1, 0],
  );

  return (
    <>
      <ChaoticParticles scrollYProgress={scrollYProgress} />
      <motion.div
        style={{
          opacity: maskOpacity,
          scale: maskScale,
          y: maskY,
          translateY: "-50%",
        }}
        className="absolute top-1/2 left-1/2 w-[300px] md:w-[400px] aspect-[4/3]"
      >
        <Image
          src="/images/concept_art_outside_nobg.png"
          alt="ThetaMask"
          fill
          className="object-contain"
        />
        <motion.div
          style={{ opacity: pulseOpacity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,20,20,0.4)_0%,rgba(255,20,20,0)_70%)] animate-pulse"
        />
      </motion.div>
    </>
  );
}
