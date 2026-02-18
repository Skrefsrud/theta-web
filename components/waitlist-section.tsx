"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitWaitlistEmail } from "@/actions/waitlist";
import { useToast } from "./toast-context";
import { SectionSeparator } from "./section-separator";

/**
 * SIMULATE_MODE - Toggle between simulation and real database calls
 *
 * true:  Simulates API calls for local testing
 *        - Use any email for success toast
 *        - Use "error@test.com" to test error toast
 * false: Makes real calls to Neon database via server actions
 *
 * Set to false before deploying to production!
 */
const SIMULATE_MODE = true;

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      showToast("Please enter a valid email address.", "error");
      return;
    }

    startTransition(async () => {
      if (SIMULATE_MODE) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate success or error based on email pattern
        const shouldError = email.includes("error@");

        if (shouldError) {
          setStatus("error");
          showToast("Failed to join waitlist. Please try again.", "error");
        } else {
          setStatus("success");
          showToast("Thank you! You've been added to the waitlist.", "success");
          setEmail("");

          setTimeout(() => {
            setStatus("idle");
          }, 2000);
        }
      } else {
        // Real server action call
        const result = await submitWaitlistEmail(email);

        if (result.success) {
          setStatus("success");
          showToast(result.message, "success");
          setEmail("");

          setTimeout(() => {
            setStatus("idle");
          }, 2000);
        } else {
          setStatus("error");
          showToast(result.message, "error");
        }
      }
    });
  };

  return (
    <>
      <SectionSeparator variant="gradient" />
      <section
        id="waitlist"
        className="relative pt-16 pb-28 md:pt-24 md:pb-28 overflow-hidden bg-brand-bg"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-brand/10 via-brand-deep/5 to-transparent blur-[120px] animate-[breathing_8s_ease-in-out_infinite]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mx-auto bg-white/[0.04] backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgb(var(--brand-rgb)/0.15),0_0_80px_rgb(var(--brand-rgb)/0.08)] border border-brand/20 p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand/5 rounded-3xl" />

            <div className="text-center space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
                  Get Early Access
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Early access + launch discount for the first 1000.
                </p>
                <p className="text-sm text-slate-400">
                  Launch discount • Priority access • 1–2 emails/month
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending || status === "success"}
                    className="flex-1 bg-white/8 border-brand/20 text-white placeholder:text-slate-500 focus:border-brand focus:ring-brand/20 h-12 rounded-full px-6"
                  />
                  <Button
                    type="submit"
                    disabled={isPending || status === "success"}
                    size="lg"
                    className="bg-brand-deep hover:bg-brand-deeper text-white font-semibold px-8 rounded-full shadow-2xl shadow-brand/20 transition-all duration-300 hover:shadow-[0_0_40px_rgb(var(--brand-rgb)/0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-12"
                  >
                    {isPending
                      ? "Saving..."
                      : status === "success"
                        ? "Claimed!"
                        : "Reserve my spot"}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block mr-1"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Privacy-first. We never share your email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
