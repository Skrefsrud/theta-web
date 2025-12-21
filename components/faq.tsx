"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionSeparator } from "./section-separator";
import { SectionLabel, SectionIcons } from "./section-label";

const faqs = [
  {
    question: "Is LED light therapy safe?",
    answer:
      "Yes, ThetaMask uses FDA-compliant LEDs that emit safe, low-intensity light. The technology has been studied extensively and is non-invasive. Our LEDs operate at wavelengths proven safe for extended use.",
  },
  {
    question: "How does brainwave entrainment work?",
    answer:
      "Brainwave entrainment uses rhythmic stimuli (in our case, light pulses) to encourage your brain to synchronize with specific frequencies. When you want to relax, the mask pulses at theta frequencies (4-8 Hz), naturally guiding your brain into that state.",
  },
  {
    question: "Who should not use ThetaMask?",
    answer:
      "ThetaMask should not be used by individuals with photosensitive epilepsy or those prone to seizures triggered by flashing lights. Pregnant women and children should consult a healthcare provider before use.",
  },
  {
    question: "How long are typical sessions?",
    answer:
      "Sessions range from 10-30 minutes depending on your goal. Sleep programs are typically 20 minutes, meditation sessions 15 minutes, and focus training 10-15 minutes. The app provides guided programs.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day trial period. If ThetaMask doesn't meet your expectations, return it for a full refund, no questions asked. We stand behind our technology.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative py-16 md:pt-24 md:pb-12 overflow-hidden bg-[#0b0b26]"
    >
      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-radial from-purple-500/10 via-cyan-500/5 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-12 md:mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
            FAQ
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about ThetaMask technology.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-white/10 bg-transparent hover:bg-white/[0.02] transition-all duration-300"
              >
                <AccordionTrigger className="text-xl md:text-2xl font-medium text-white hover:text-cyan-400 text-left py-6 px-2 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg text-slate-300 leading-relaxed pb-6 px-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
