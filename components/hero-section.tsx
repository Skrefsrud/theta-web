"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { JoinWaitlistButton } from "./join-waitlist-button";
import { TrustBar } from "./trust-bar";

export function HeroSection() {
  const maskRef = useRef<HTMLDivElement>(null);

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
        className="relative min-h-screen flex flex-col overflow-hidden pt-16 md:pt-20"
      >
        <div className="absolute right-[35%] top-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand/12 via-brand-deep/6 to-transparent blur-[120px] rounded-[50%] opacity-70 animate-[breathing_8s_ease-in-out_infinite]" />

        <div className="relative flex-1 flex items-center container mx-auto px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 flex flex-col justify-center space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-[1.1] tracking-tight">
                Calm Your Mind with{" "}
                <span className="bg-gradient-to-r from-brand-subtle to-brand bg-clip-text text-transparent">
                  Science-Backed
                </span>
                <br />
                Visual Stimulation
              </h1>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience brainwave entrainment through light and sound
                stimulation. ThetaMask helps you achieve better relaxation,
                improved sleep, and deeper meditative states.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <JoinWaitlistButton
                  size="lg"
                  className="font-semibold text-lg px-10 py-7 rounded-full shadow-2xl shadow-brand/20 transition-all duration-300 hover:scale-105 active:scale-100"
                >
                  Save My Spot!
                </JoinWaitlistButton>

                <p className="text-sm text-slate-400/90 text-center sm:text-left">
                  First 1000 get launch pricing • Launching soon
                </p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex items-center justify-center">
              <div
                ref={maskRef}
                className="relative w-full max-w-lg aspect-[4/3] transition-transform duration-100 ease-out group"
              >
                <div className="absolute inset-0 bg-gradient-radial from-brand/18 via-brand-deep/8 to-transparent blur-3xl scale-110 animate-[breathing_6s_ease-in-out_infinite]" />

                <div className="absolute inset-0 bg-gradient-to-br from-brand-light/10 to-brand-deeper/6 blur-2xl rounded-full" />

                <div className="absolute inset-0 scale-95 bg-gradient-to-b from-transparent via-transparent to-black/40 blur-xl" />

                <Image
                  src="/images/concept_art_outside_nobg.png"
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
        <div className="relative">
          <TrustBar />
        </div>
      </section>
    </>
  );
}
