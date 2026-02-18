"use client";

import { useToast } from "./toast-context";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[rgba(13,17,23,0.95)] backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] p-4 min-w-[320px] max-w-md animate-in slide-in-from-top-5 fade-in-0 duration-300"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-brand-light flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}

            {/* Message */}
            <p
              className={`flex-1 text-sm font-medium ${
                toast.type === "success" ? "text-white" : "text-red-100"
              }`}
            >
              {toast.message}
            </p>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                toast.type === "success" ? "bg-brand-light" : "bg-red-400"
              } animate-[shrink_5s_linear]`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
