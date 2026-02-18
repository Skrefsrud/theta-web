"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JoinWaitlistButton } from "./join-waitlist-button";

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
          ? "bg-brand-bg/90 backdrop-blur-2xl border-b border-white/8 shadow-xl"
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
              <Image
                src="/images/logo2.png"
                alt="ThetaMask logo"
                width={40}
                height={40}
                quality={100}
                className="drop-shadow-[0_0_8px_rgb(var(--brand-rgb)/0.5)] group-hover:drop-shadow-[0_0_12px_rgb(var(--brand-rgb)/0.7)] transition-all duration-300"
              />
              <span className="text-xl font-bold text-white">ThetaMask</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/logo2.png"
                alt="ThetaMask logo"
                width={40}
                height={40}
                quality={100}
                className="drop-shadow-[0_0_8px_rgb(var(--brand-rgb)/0.5)] group-hover:drop-shadow-[0_0_12px_rgb(var(--brand-rgb)/0.7)] transition-all duration-300"
              />
              <span className="text-xl font-bold text-white">ThetaMask</span>
            </Link>
          )}

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/science"
              className="text-slate-300 hover:text-brand-light transition-colors duration-200 font-medium"
            >
              Science
            </Link>

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
