"use client";

import { Shield, Award, Users, Calendar } from "lucide-react";
import { useState, useRef } from "react";

const trustIndicators = [
  {
    icon: Shield,
    text: "30-Day Trial Guarantee",
    tooltip:
      "Try ThetaMask risk-free for 30 days. Full refund if not satisfied.",
    details:
      "We stand behind our product with a 30-day money-back guarantee. If ThetaMask doesn't meet your expectations, return it for a full refund—no questions asked. Your satisfaction and well-being are our top priority.",
  },
  {
    icon: Award,
    text: "Research-Based Technology",
    tooltip:
      "Built on peer-reviewed studies in neurofeedback and LED light therapy.",
    details:
      "ThetaMask is grounded in decades of research on brainwave entrainment and photic stimulation. Our technology leverages peer-reviewed studies to deliver safe, effective results backed by neuroscience.",
  },
  {
    icon: Users,
    text: "Tested with Beta Users",
    tooltip: "Real-world results from early adopters.",
    details:
      "Join early users who have experienced the transformative effects of ThetaMask. Our beta community reports improvements in sleep quality, stress reduction, and mental clarity.",
  },
  {
    icon: Calendar,
    text: "No adverse side effects",
    tooltip: "Components meeting safety and performance standards.",
    details:
      "In our beta testing, no users reported adverse side effects. ThetaMask is designed with user safety in mind, users with epilepsy or other photosensitive medical conditions should not use ThetaMask.",
  },
];

export function TrustBar() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="relative pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustIndicators.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setExpandedIndex(index)}
                onMouseLeave={() => setExpandedIndex(null)}
              >
                {/* Icon Container */}
                <div className="flex flex-col items-center justify-center gap-3 text-center group cursor-pointer">
                  {/* Glass accent circle with glow */}
                  <div className="relative">
                    {/* Ambient glow behind icon */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-full blur-lg opacity-40 transition-opacity duration-300 animate-[pulse_3s_ease-in-out_infinite]" />

                    {/* Glass circle container */}
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-full p-4 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300">
                      <item.icon className="w-6 h-6 text-cyan-400 drop-shadow-[0_2px_8px_rgba(6,182,212,0.6)]" />
                    </div>
                  </div>

                  {/* Enhanced typography */}
                  <p className="text-xs md:text-sm text-slate-100 font-semibold tracking-tight leading-tight max-w-[140px]">
                    {item.text}
                  </p>
                </div>

                {/* Expandable Card */}
                {expandedIndex === index && (
                  <div
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 md:w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.6)] z-50 animate-[fadeIn_300ms_ease-out]"
                  >
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full p-2.5">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {item.text}
                      </h3>
                    </div>

                    {/* Details */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.details}
                    </p>

                    {/* Arrow pointer */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-cyan-400/30 rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
