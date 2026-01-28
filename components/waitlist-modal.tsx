"use client";

import type React from "react";
import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Lock } from "lucide-react";
import { submitWaitlistEmail } from "@/actions/waitlist";
import { useToast } from "./toast-context";

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
const SIMULATE_MODE = false;

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure modal animation completes
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      showToast("Please enter a valid email address.", "error");
      return;
    }

    startTransition(async () => {
      if (SIMULATE_MODE) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate success or error based on email pattern
        // Use "error@test.com" to test error state, any other email for success
        const shouldError = email.includes("error@");

        if (shouldError) {
          setStatus("error");
          setErrorMessage("Failed to join waitlist. Please try again.");
          showToast("Failed to join waitlist. Please try again.", "error");
        } else {
          setStatus("success");
          setEmail("");
          setErrorMessage("");
          showToast("Thank you! You've been added to the waitlist.", "success");

          setTimeout(() => {
            setStatus("idle");
            onOpenChange(false);
          }, 1500);
        }
      } else {
        // Real server action call
        const result = await submitWaitlistEmail(email);

        if (result.success) {
          setStatus("success");
          setEmail("");
          setErrorMessage("");
          showToast(result.message, "success");

          setTimeout(() => {
            setStatus("idle");
            onOpenChange(false);
          }, 1500);
        } else {
          setStatus("error");
          setErrorMessage(result.message);
          showToast(result.message, "error");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-[rgba(13,17,23,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
        >
          <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </button>

        <div className="relative p-8 md:p-10 space-y-6">
          <DialogTitle className="sr-only">Join the Waitlist</DialogTitle>

          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
              Get Early Access
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              Early access + launch discount for the first 1000.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-2 text-slate-300 text-sm md:text-base text-left max-w-xs mx-auto">
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span>
              <span>Reserved launch discount</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span>
              <span>Priority access when we launch</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span>
              <span>1–2 updates/month (no spam)</span>
            </li>
          </ul>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <Input
                ref={inputRef}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#0f0f11]/60 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400 h-12 px-4 rounded-xl focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 ${
                  status === "error" ? "animate-shake border-red-500/50" : ""
                }`}
              />
              <p className="text-xs text-slate-500 mt-2 ml-1">
                Only email for news + launch discount. Unsubscribe anytime.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold h-12 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Reserve My Spot"}
            </Button>
          </form>

          {/* Status messages */}
          {status === "success" && (
            <div className="text-center text-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300 space-y-1">
              <p className="text-cyan-400 font-medium">
                ✓ You're in! We'll email you when early access opens.
              </p>
              <p className="text-slate-300">
                If you're in the first 1000, you'll get founder pricing at
                launch.
              </p>
            </div>
          )}
          {status === "error" && (
            <p className="text-red-400 font-medium text-center text-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              {errorMessage}
            </p>
          )}

          {/* Footer text */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center pt-2">
            <Lock className="w-3 h-3" />
            <span>Privacy-first. We never share your email.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
