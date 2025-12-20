import Image from "next/image";

const sections = [
  {
    problem: "Stressed and Wired at Bedtime?",
    empathy:
      "Your mind races with thoughts from the day. Anxiety keeps you tossing and turning. Quality sleep feels impossible.",
    solution:
      "ThetaMask uses scientifically-calibrated LED light pulses to guide your brainwaves into a deeply relaxed theta state, helping you fall asleep naturally.",
    image: "/images/theta-sleeping.png",
  },
  {
    problem: "Struggling to Meditate or Focus?",
    empathy:
      "Traditional meditation feels like a constant battle against distraction. Your mind wanders after just seconds.",
    solution:
      "Brainwave entrainment through synchronized light patterns trains your brain to enter meditative states effortlessly, building focus over time.",
    image: "/images/theta-meditating.png",
  },
];

export function ProblemSolution() {
  return (
    <section id="science" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 via-purple-500/5 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-16">
        {sections.map((section, index) => (
          <div key={index} className="p-10 md:p-20">
            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-12 items-start`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-balance mb-8 drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]">
                  {section.problem}
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {section.empathy}
                </p>
                <div className="pt-4 border-t-2 border-cyan-500/50">
                  <p className="text-xl text-slate-200 leading-relaxed font-medium">
                    {section.solution}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src={section.image || "/placeholder.svg"}
                  alt={section.problem}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
