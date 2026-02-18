import { HeroSection } from "@/components/hero-section";
import { ProblemSolution } from "@/components/problem-solution";
import { FeaturesGrid } from "@/components/features-grid";
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
          <ProblemSolution />

          <FeaturesGrid />

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
