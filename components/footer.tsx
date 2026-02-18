import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-white/8 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-brand rounded-full blur-lg opacity-30" />
                <Image
                  src="/images/logo2.png"
                  alt="ThetaMask logo"
                  width={40}
                  height={40}
                  quality={100}
                  className="relative drop-shadow-[0_0_10px_rgb(var(--brand-rgb)/0.6)]"
                />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                ThetaMask
              </h3>
            </div>
            <p className="text-slate-400 text-sm">
              Science-backed brainwave entrainment technology
            </p>
          </div>

          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-brand-light transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-light transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-brand-light transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ThetaMask. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
