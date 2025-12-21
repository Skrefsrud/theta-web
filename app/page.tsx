import { HeroSection } from "@/components/hero-section";
import { TrustBar } from "@/components/trust-bar";
import { ProblemSolution } from "@/components/problem-solution";
import { StatsSection } from "@/components/stats-section";
import { FeaturesGrid } from "@/components/features-grid";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { WaitlistSection } from "@/components/waitlist-section";
import { Footer } from "@/components/footer";
import { StickyHeader } from "@/components/sticky-header";
import { WaitlistProvider } from "@/components/waitlist-context";
import { WaitlistModalWrapper } from "@/components/waitlist-modal-wrapper";
import { ToastProvider } from "@/components/toast-context";
import { ToastContainer } from "@/components/toast-container";

export default function HomePage() {
  return (
    <ToastProvider>
      <WaitlistProvider>
        <main className="min-h-screen">
          <StickyHeader />
          <HeroSection />
          <TrustBar />
          <ProblemSolution />
          <StatsSection />
          <FeaturesGrid />
          <Testimonials />
          <WaitlistSection />
          <FAQ />
          <Footer />
        </main>
        <WaitlistModalWrapper />
        <ToastContainer />
      </WaitlistProvider>
    </ToastProvider>
  );
}
