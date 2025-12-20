"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useWaitlist } from "./waitlist-context";

export function HeroSection() {
  const maskRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  useEffect(() => {
    const handleScroll = () => {
      if (maskRef.current) {
        const scrollY = window.scrollY;
        maskRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20"
      >
        <div className="absolute right-[35%] top-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-cyan-400/20 via-indigo-500/15 to-transparent blur-[120px] rounded-[50%] opacity-70 animate-[breathing_8s_ease-in-out_infinite]" />

        <div className="relative container mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 flex flex-col justify-center space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-[1.1] tracking-tight">
                Calm Your Mind with{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Science-Backed
                </span>
                <br />
                Light Therapy
              </h1>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience brainwave entrainment through precision LED therapy.
                ThetaMask helps you achieve deep relaxation, improved sleep, and
                sharper focus.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                <Button
                  onClick={openModal}
                  size="lg"
                  className="group relative bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold text-lg px-10 py-7 rounded-full shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-100 border border-cyan-400/20"
                >
                  <span className="relative z-10">Join the Waitlist</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                </Button>

                <p className="text-sm text-slate-400/90 italic">
                  Limited early access • Launching soon
                </p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex items-center justify-center">
              <div
                ref={maskRef}
                className="relative w-full max-w-lg aspect-[4/3] transition-transform duration-100 ease-out group"
              >
                <div className="absolute inset-0 bg-gradient-radial from-cyan-400/30 via-purple-400/20 to-transparent blur-3xl scale-110 animate-[breathing_6s_ease-in-out_infinite]" />

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/15 to-purple-500/15 blur-2xl rounded-full" />

                <div className="absolute inset-0 scale-95 bg-gradient-to-b from-transparent via-transparent to-black/40 blur-xl" />

                <Image
                  src="/images/concept-art-outside-nobg.png"
                  alt="ThetaMask LED Meditation Mask"
                  width={800}
                  height={600}
                  className="relative z-10 object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out animate-[float_6s_ease-in-out_infinite]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
