import { Zap, Smartphone, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Precision LED Therapy",
    description:
      "Medical-grade LEDs deliver precisely-timed light pulses to guide your brainwaves safely and effectively.",
  },
  {
    icon: Smartphone,
    title: "App-Controlled Sessions",
    description:
      "Customize your experience with our intuitive app. Choose from sleep, meditation, or focus programs.",
  },
  {
    icon: Shield,
    title: "Comfort by Design",
    description:
      "Ergonomic, breathable materials ensure maximum comfort during extended sessions. Adjustable fit for all head sizes.",
  },
  {
    icon: Headphones,
    title: "Audio Integration",
    description:
      "Sync with binaural beats and ambient soundscapes for enhanced brainwave entrainment.",
  },
];

export function FeaturesGrid() {
  return (
    <section
      id="features"
      className="relative py-16 md:py-20 bg-transparent overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 via-cyan-500/5 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance tracking-tight">
            Technology Meets Tranquility
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Every detail of ThetaMask is engineered to optimize your mental
            wellness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group transition-all duration-700 ease-in-out"
            >
              {/* Glassmorphism card */}
              <div className="relative bg-white/[0.03] backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_48px_rgba(6,182,212,0.2)] transition-all duration-700">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-shadow duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
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
