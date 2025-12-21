"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const features = [
  {
    title: "Precision LED Therapy",
    description:
      "Medical-grade LEDs deliver precisely timed light pulses, tuned to your brain's rhythm.",
    badge: "Your first session begins.",
    image: "/images/mask-inside-red.png",
    step: 1,
  },
  {
    title: "App-Controlled Sessions",
    description:
      "Control your experience with our mobile app. Tap into tailored sessions for sleep, meditation, or peak focus.",
    badge: "You're in control.",
    image: "/images/phone-app.png",
    step: 2,
  },
  {
    title: "Immersive Comfort",
    description:
      "Ergonomic, breathable design ensures comfort for any head shape. Forget it's even there.",
    badge: "Designed for real life.",
    image: "/images/theta-rest.png",
    step: 3,
  },
  {
    title: "Audio Integration",
    description:
      "Sync ambient soundscapes and binaural beats to deepen entrainment.",
    badge: "Total immersion.",
    image: "/images/phone-app-sound.png",
    step: 4,
  },
];

function FeatureStep({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const imageY = useSpring(
    useTransform(scrollYProgress, [0, 1], isEven ? [100, -100] : [-100, 100]),
    springConfig
  );
  const imageOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0]),
    springConfig
  );
  const imageScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
    springConfig
  );

  const textY = useSpring(
    useTransform(scrollYProgress, [0, 1], isEven ? [-50, 50] : [50, -50]),
    springConfig
  );
  const textOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]),
    springConfig
  );

  const badgeOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 0, 1, 1, 0]),
    springConfig
  );
  const badgeScale = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.5], [0.8, 0.8, 1]),
    springConfig
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-4 md:px-6"
      aria-label={`Feature ${feature.step}: ${feature.title}`}
      role="region"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div
          className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
            !isEven ? "md:grid-flow-dense" : ""
          }`}
        >
          <motion.div
            style={{
              y: imageY,
              opacity: imageOpacity,
              scale: imageScale,
              x: mousePosition.x,
            }}
            className={`relative ${!isEven ? "md:col-start-2" : ""}`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              <motion.div
                style={{ opacity: badgeOpacity, scale: badgeScale }}
                className="absolute top-6 left-6 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50 text-white font-bold text-sm"
              >
                Step {feature.step}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            style={{
              y: textY,
              opacity: textOpacity,
              x: -mousePosition.x * 0.5,
            }}
            className={`space-y-6 ${
              !isEven ? "md:col-start-1 md:row-start-1" : ""
            }`}
          >
            <motion.div
              style={{ opacity: badgeOpacity, scale: badgeScale }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-cyan-300">
                {feature.badge}
              </span>
            </motion.div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
              {feature.title}
            </h3>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
              {feature.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressHeight = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
    {
      stiffness: 100,
      damping: 30,
    }
  );

  const progressBarX = useSpring(
    useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [100, 0, 0, 100]),
    {
      stiffness: 80,
      damping: 20,
    }
  );

  const progressBarOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
    {
      stiffness: 80,
      damping: 20,
    }
  );

  const currentStep = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [1, 1, 2, 3, 4]
  );
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    return currentStep.on("change", (latest) => {
      setActiveStep(Math.round(latest));
    });
  }, [currentStep]);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative py-0 overflow-visible"
      aria-label="Product features walkthrough"
    >
      <div className="fixed left-1/4 top-1/3 w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
      <div className="fixed right-1/4 bottom-1/3 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <motion.div
        style={{ x: progressBarX, opacity: progressBarOpacity }}
        className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-50"
      >
        <div className="relative w-0.5 h-64 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            style={{ height: progressHeight }}
            className="w-full bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"
          />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col h-64 justify-between">
          {[1, 2, 3, 4].map((step) => (
            <motion.button
              key={step}
              className={`w-3 h-3 rounded-full transition-all ${
                activeStep >= step
                  ? "bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50"
                  : "bg-white/20"
              }`}
              whileHover={{ scale: 1.5 }}
              onClick={() => {
                const element = document.querySelector(
                  `[aria-label*="Feature ${step}"]`
                );
                element?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              aria-label={`Jump to step ${step}`}
            />
          ))}
        </div>

        <motion.div
          className="mt-4 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-xs font-medium text-white">
            Step {activeStep} of 4
          </span>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance tracking-tight">
            Meet ThetaMask
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            An immersive journey through precision technology designed for your
            mind.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden md:block pointer-events-none" />

        {features.map((feature, index) => (
          <FeatureStep key={index} feature={feature} index={index} />
        ))}
      </div>

      <div className="h-24" />
    </section>
  );
}
