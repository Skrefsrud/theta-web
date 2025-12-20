"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { submitWaitlistEmail } from "@/actions/waitlist";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const result = await submitWaitlistEmail(email);

      if (result.success) {
        setStatus("success");
        setEmail("");
        setErrorMessage("");

        setTimeout(() => {
          setStatus("idle");
          onOpenChange(false);
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(result.message);
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
              Join the Waitlist
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              Early access. Exclusive pricing. No spam — ever.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#0f0f11]/60 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400 h-12 px-4 rounded-xl focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 ${
                  status === "error" ? "animate-shake border-red-500/50" : ""
                }`}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold h-12 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>

          {/* Status messages */}
          {status === "success" && (
            <p className="text-cyan-400 font-medium text-center text-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              ✓ Thank you! You've been added to the waitlist.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 font-medium text-center text-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              {errorMessage}
            </p>
          )}

          {/* Footer text */}
          <p className="text-xs text-slate-500 text-center">
            Limited spots available • Unsubscribe anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
