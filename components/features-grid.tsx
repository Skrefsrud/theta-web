import { Zap, Smartphone, Shield, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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
    description: "Customize your experience with our intuitive app. Choose from sleep, meditation, or focus programs.",
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
    description: "Sync with binaural beats and ambient soundscapes for enhanced brainwave entrainment.",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 via-cyan-500/5 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 p-10 md:p-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance tracking-tight">
              Technology Meets Tranquility
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Every detail of ThetaMask is engineered to optimize your mental wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border border-white/10 bg-[#0f0f11]/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-shadow duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
