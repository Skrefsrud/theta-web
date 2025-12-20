import { HeroSection } from "@/components/hero-section";
import { TrustBar } from "@/components/trust-bar";
import { ProblemSolution } from "@/components/problem-solution";
import { FeaturesGrid } from "@/components/features-grid";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";
import { StickyHeader } from "@/components/sticky-header";
import { WaitlistProvider } from "@/components/waitlist-context";

export default function HomePage() {
  return (
    <WaitlistProvider>
      <main className="min-h-screen">
        <StickyHeader />
        <HeroSection />
        <TrustBar />
        <ProblemSolution />
        <FeaturesGrid />
        <Testimonials />
        <FAQ />
        <WaitlistSection />
        <Footer />
      </main>
    </WaitlistProvider>
  );
}
