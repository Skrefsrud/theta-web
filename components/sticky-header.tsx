"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JoinWaitlistButton } from "./join-waitlist-button";
import { useWaitlist } from "./waitlist-context";

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
          {isHomePage ? (
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all duration-300">
                <span className="text-white font-bold text-lg">θ</span>
              </div>
              <span className="text-xl font-bold text-white">ThetaMask</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all duration-300">
                <span className="text-white font-bold text-lg">θ</span>
              </div>
              <span className="text-xl font-bold text-white">ThetaMask</span>
            </Link>
          )}

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Features
            </button>
            <Link
              href="/science"
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              Science
            </Link>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              FAQ
            </button>
            <JoinWaitlistButton className="px-6 py-2 rounded-full">
              Get early access
            </JoinWaitlistButton>
          </nav>

          {/* Mobile menu button - could be expanded later */}
          <JoinWaitlistButton className="md:hidden px-4 py-2 rounded-full text-sm">
            Join
          </JoinWaitlistButton>
        </div>
      </div>
    </header>
  );
}
