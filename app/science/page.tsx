import { ScienceContent } from "@/components/science-content";
import { StickyHeader } from "@/components/sticky-header";
import { Footer } from "@/components/footer";
import { WaitlistProvider } from "@/components/waitlist-context";
import { WaitlistModalWrapper } from "@/components/waitlist-modal-wrapper";
import { ToastProvider } from "@/components/toast-context";
import { ToastContainer } from "@/components/toast-container";

export const metadata = {
  title: "Science | ThetaMask - Brainwave Entrainment Research",
  description:
    "Explore the peer-reviewed research behind ThetaMask's brainwave entrainment technology for relaxation, sleep, and meditation.",
};

export default function SciencePage() {
  return (
    <ToastProvider>
      <WaitlistProvider>
        <main className="min-h-screen bg-brand-bg">
          <StickyHeader />
          <ScienceContent />
          <Footer />
        </main>
        <WaitlistModalWrapper />
        <ToastContainer />
      </WaitlistProvider>
    </ToastProvider>
  );
}
