export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="relative w-10 h-10">
                {/* Glowing theta symbol */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-md opacity-50" />
                <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">θ</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                ThetaMask
              </h3>
            </div>
            <p className="text-slate-400 text-sm">Science-backed brainwave entrainment technology</p>
          </div>

          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ThetaMask. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
