import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Beta Tester",
    quote:
      "I've struggled with insomnia for years. ThetaMask helped me fall asleep faster than any medication or meditation app I've tried. It's honestly life-changing.",
    rating: 5,
  },
  {
    name: "James L.",
    role: "Software Engineer",
    quote:
      "As someone who meditates daily, this accelerated my practice by months. I reach deep states in minutes instead of struggling for an hour.",
    rating: 5,
  },
  {
    name: "Dr. Emily R.",
    role: "Neuroscience Researcher",
    quote:
      "The science behind brainwave entrainment is solid. ThetaMask implements it beautifully with precise timing and quality hardware.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute left-1/3 top-1/3 w-[500px] h-[500px] bg-gradient-radial from-cyan-500/10 via-indigo-500/5 to-transparent blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 p-10 md:p-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance tracking-tight">
              Trusted by Early Adopters
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Join hundreds of users transforming their mental wellness with ThetaMask.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-[#0f0f11]/80 backdrop-blur-sm border border-white/10 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
