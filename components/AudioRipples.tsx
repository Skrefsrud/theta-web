"use client";

import React from "react";

export function AudioRipples() {
  return (
    <>
      <style jsx>{`
        .ripple-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          border-width: 1px;
          border-color: rgba(107, 227, 255, 0.3);
          box-shadow: 0 0 12px 0 rgba(107, 227, 255, 0.25);
          animation: ripple-animation 3s infinite cubic-bezier(0.2, 0.8, 0.8, 1);
        }

        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ripple-ring {
            animation: none;
          }
        }
      `}</style>
      <div className="relative w-full h-full aspect-square bg-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Center Glow Dot */}
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgba(107,227,255,0.5)]" />

          {/* Static rings for reduced motion */}
          <div className="motion-safe:hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="ripple-ring"
                style={{
                  width: `${(i + 1) * 20}%`,
                  height: `${(i + 1) * 20}%`,
                  opacity: 0.3 - i * 0.05,
                }}
              />
            ))}
          </div>

          {/* Animated rings */}
          <div className="motion-safe:block">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="ripple-ring"
                style={{
                  width: "100%",
                  height: "100%",
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
