"use client";

import { useEffect, useRef, useState } from "react";
import { SectionSeparator } from "./section-separator";
import { SectionLabel, SectionIcons } from "./section-label";

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      title: "Improve Sleep",
      percentage: "77%",
      description: "Users report better sleep quality within 2 weeks",
    },
    {
      title: "Reduce Stress",
      percentage: "85%",
      description: "Experience measurable stress reduction in sessions",
    },
    {
      title: "Boost Focus",
      percentage: "92%",
      description: "Enhanced mental clarity and concentration reported",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative pt-0 pb-16 md:pb-24 bg-brand-bg overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-brand/8 via-brand-deep/3 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-700 ease-in-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Glassmorphism card */}
              <div className="relative bg-white/[0.03] backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-700">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand/4 via-transparent to-brand-deep/4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="relative z-10 text-center space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-white/90">
                    {stat.title}
                  </h3>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-brand-subtle to-brand bg-clip-text text-transparent">
                    {stat.percentage}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
