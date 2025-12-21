"use client";

import { useWaitlist } from "./waitlist-context";
import { WaitlistModal } from "./waitlist-modal";

export function WaitlistModalWrapper() {
  const { isOpen, closeModal } = useWaitlist();
  return <WaitlistModal open={isOpen} onOpenChange={closeModal} />;
}
