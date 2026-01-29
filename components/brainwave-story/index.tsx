"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { BrainwaveVisualization } from "./brainwave-visualization";
import { StoryContent } from "./story-content";
import { SectionSeparator } from "../section-separator";

export function BrainwaveStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <SectionSeparator variant="gradient" />
      <section
        id="story"
        ref={containerRef}
        className="relative h-[400vh] bg-[#0a0a20] text-white"
        aria-label="How ThetaMask Works"
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <BrainwaveVisualization scrollYProgress={scrollYProgress} />
          <StoryContent scrollYProgress={scrollYProgress} />
        </div>
      </section>
    </>
  );
}
