"use client";

import { useState, useEffect } from "react";
import { useWaitlist } from "./waitlist-context";

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { openModal } = useWaitlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,box-shadow] duration-300 ${
        isScrolled
          ? "bg-[#0D1025]/80 backdrop-blur-2xl border-b border-white/10 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all duration-300">
              <span className="text-white font-bold text-lg">θ</span>
            </div>
            <span className="text-xl font-bold text-white">ThetaMask</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("science")}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Science
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              FAQ
            </button>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300"
            >
              Join Waitlist
            </button>
          </nav>

          {/* Mobile menu button - could be expanded later */}
          <button
            onClick={openModal}
            className="md:hidden bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            Join
          </button>
        </div>
      </div>
    </header>
  );
}
