"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitWaitlistEmail } from "@/actions/waitlist";
import { useToast } from "./toast-context";
import { SectionSeparator } from "./section-separator";
import { SectionLabel, SectionIcons } from "./section-label";

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
        className="relative pt-16 pb-28 md:pt-24 md:pb-28 overflow-hidden bg-[#0b0b26]"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-[120px] animate-[breathing_8s_ease-in-out_infinite]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mx-auto bg-white/[0.07] backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(6,182,212,0.3),0_0_80px_rgba(147,51,234,0.2)] border-2 border-cyan-500/30 p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-3xl" />

            <div className="text-center space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
                  Stay Ahead of the Curve
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Secure your access today. Join our exclusive waitlist and be
                  the first to experience the future of mindfulness technology.
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
                    className="flex-1 bg-white/10 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/30 h-12 rounded-full px-6"
                  />
                  <Button
                    type="submit"
                    disabled={isPending || status === "success"}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 rounded-full shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-12"
                  >
                    {isPending
                      ? "Joining..."
                      : status === "success"
                      ? "Joined!"
                      : "Join Waitlist"}
                  </Button>
                </div>
              </form>

              <p className="text-sm text-slate-400">
                Limited spots available • Early bird pricing for members
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
