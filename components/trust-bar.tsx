import { Shield, Award, Users, Calendar } from "lucide-react"

const trustIndicators = [
  {
    icon: Shield,
    text: "30-Day Trial Guarantee",
  },
  {
    icon: Award,
    text: "Research-Based Technology",
  },
  {
    icon: Users,
    text: "500+ Beta Users",
  },
  {
    icon: Calendar,
    text: "FDA-Compliant LEDs",
  },
]

export function TrustBar() {
  return (
    <section className="relative pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-center">
                <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <p className="text-xs md:text-sm text-slate-300 leading-tight">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
