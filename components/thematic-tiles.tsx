"use client";

export function ThematicTiles() {
  const tiles = [
    {
      icon: (
        <svg
          className="w-12 h-12 md:w-16 md:h-16"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="rgb(var(--brand-rgb) / 0.08)"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand-light)" />
              <stop offset="100%" stopColor="var(--color-brand)" />
            </linearGradient>
          </defs>
        </svg>
      ),
      title: "Train",
      description:
        "Guide your mind into theta state with precision LED patterns designed for deep relaxation and meditation mastery.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 md:w-16 md:h-16"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="rgb(var(--brand-rgb) / 0.08)"
          />
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand)" />
              <stop offset="100%" stopColor="var(--color-brand-light)" />
            </linearGradient>
          </defs>
        </svg>
      ),
      title: "Boost",
      description:
        "Enhance cognitive performance and mental clarity through scientifically-backed brainwave entrainment technology.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 md:w-16 md:h-16"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
            stroke="url(#gradient3)"
            strokeWidth="2"
            fill="rgb(var(--brand-rgb) / 0.08)"
          />
          <defs>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand-light)" />
              <stop offset="100%" stopColor="var(--color-brand-deep)" />
            </linearGradient>
          </defs>
        </svg>
      ),
      title: "Assess",
      description:
        "Track your progress and measure improvements in focus, sleep quality, and stress reduction over time.",
    },
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-brand/8 via-brand-deep/3 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-6 md:px-12">
        {/* Containerized bordered section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/[0.02] to-white/[0.05] backdrop-blur-sm rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.4)] p-8 md:p-12">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-brand/8 opacity-50 blur-xl pointer-events-none" />

          <div className="relative space-y-8 md:space-y-12">
            {tiles.map((tile, index) => (
              <div
                key={index}
                className="group relative bg-brand-surface/60 backdrop-blur-md rounded-2xl border border-white/8 p-8 md:p-10 transition-all duration-700 ease-in-out hover:scale-105 hover:shadow-[0_8px_48px_rgb(var(--brand-rgb)/0.2)] hover:border-brand/25"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-brand/3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* Hexagonal icon */}
                  <div className="transition-transform duration-700 group-hover:scale-110">
                    {tile.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-subtle">
                    {tile.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
                    {tile.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
