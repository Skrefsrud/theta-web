import { HeroSection } from "@/components/hero-section";
import { TrustBar } from "@/components/trust-bar";
import { BrainwaveStory } from "@/components/brainwave-story";
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
          <BrainwaveStory />

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
