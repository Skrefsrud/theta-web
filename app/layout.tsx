import type React from "react";
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import {
  Maven_Pro,
  Geist_Mono,
  Source_Serif_4,
  Maven_Pro as V0_Font_Maven_Pro,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google";

// Initialize fonts
const _mavenPro = V0_Font_Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mono",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "ThetaMask - Science-Backed LED Meditation & Sleep Mask",
  description:
    "Experience deeper relaxation, better sleep, and enhanced focus with ThetaMask. Precision LED therapy and brainwave entrainment technology for mental wellness.",
  generator: "v0.app",
  keywords: [
    "meditation mask",
    "LED therapy",
    "brainwave entrainment",
    "sleep technology",
    "theta waves",
    "wellness technology",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mavenPro.variable} ${geistMono.variable} ${sourceSerif4.variable} font-sans antialiased bg-gradient-to-br from-[#0D1025] via-[#0f1130] to-[#14153B] min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
