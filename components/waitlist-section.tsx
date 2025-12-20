"use client";

import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";
import { useWaitlist } from "./waitlist-context";

export function WaitlistSection() {
  const { openModal, isOpen, closeModal } = useWaitlist();

  return (
    <>
      <section
        id="waitlist"
        className="relative py-16 md:py-20 overflow-hidden"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-[120px] animate-[breathing_8s_ease-in-out_infinite]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mx-auto bg-white/[0.07] backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(6,182,212,0.3),0_0_80px_rgba(147,51,234,0.2)] border-2 border-cyan-500/30 p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-3xl" />

            <div className="text-center space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
                  Stay Ahead of the Curve
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Secure your access today. Join our exclusive waitlist and be
                  the first to experience the future of mindfulness technology.
                </p>
              </div>

              <Button
                onClick={openModal}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold text-lg px-12 py-7 rounded-full shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-105"
              >
                Join the Waitlist
              </Button>

              <p className="text-sm text-slate-400">
                Limited spots available • Early bird pricing for members
              </p>
            </div>
          </div>
        </div>
      </section>

      <WaitlistModal open={isOpen} onOpenChange={closeModal} />
    </>
  );
}
