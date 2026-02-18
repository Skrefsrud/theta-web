"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Beta Tester",
    detail: "Early Access User since May 2025",
    quote:
      "I've struggled with insomnia for years. ThetaMask helped me fall asleep faster than any medication or meditation app I've tried. It's honestly life-changing.",
  },
  {
    name: "James Rodriguez",
    role: "Software Engineer",
    detail: "Daily Meditator",
    quote:
      "As someone who meditates daily, this accelerated my practice by months. I reach deep states in minutes instead of struggling for an hour.",
  },
  {
    name: "Dr. Emily Chen",
    role: "Neuroscience Researcher",
    detail: "PhD, Stanford University",
    quote:
      "The science behind brainwave entrainment is solid. ThetaMask implements it beautifully with precise timing and quality hardware. I recommend it to my patients.",
  },
];

export function Testimonials() {
  return (
    <section className="pt-8 pb-20 md:pt-12 md:pb-32 px-6 bg-brand-bg relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute right-1/4 top-1/4 w-[800px] h-[800px] bg-gradient-radial from-brand/8 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Trusted by Early Adopters
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Real stories from people who transformed their sleep and meditation
            practice
          </motion.p>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group flex flex-col h-full transition-all duration-700"
            >
              {/* Glassmorphism card */}
              <div className="relative bg-white/[0.03] backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-700 flex flex-col h-full">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-brand/4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Quotation mark */}
                  <div className="text-5xl font-serif text-slate-700 mb-4 leading-none">
                    &quot;
                  </div>

                  {/* Quote */}
                  <blockquote className="text-slate-200 text-base md:text-lg leading-relaxed mb-6 flex-grow">
                    {testimonial.quote}
                  </blockquote>

                  {/* Author info */}
                  <div className="border-t border-slate-700/50 pt-4 mt-auto">
                    <p className="text-white font-semibold text-base mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {testimonial.detail}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
