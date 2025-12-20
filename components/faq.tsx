import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <section id="faq" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-radial from-purple-500/10 via-cyan-500/5 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="p-10 md:p-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Everything you need to know about ThetaMask technology.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/10 rounded-lg px-6 bg-[#0f0f11]/60 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all duration-300"
                >
                  <AccordionTrigger className="text-lg font-semibold text-white hover:text-cyan-400 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
