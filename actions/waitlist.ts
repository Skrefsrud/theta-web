"use server";

import { addToWaitlist } from "@/lib/waitlist";

export async function submitWaitlistEmail(email: string) {
  try {
    await addToWaitlist(email);
    return { success: true, message: "Thank you! You've been added to the waitlist." };
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to join waitlist. Please try again.",
    };
  }
}
