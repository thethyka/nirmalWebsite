"use client";

import { useEffect, useState } from "react";

/**
 * Quiet, warm ambience for the memorial pages: a faint floral flourish
 * framing the top corners and a few slow-drifting gold petals. Deliberately
 * low-contrast so it never competes with the content — the opposite of the
 * old confetti/balloons.
 */

function Floral({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 8c34 2 60 12 78 34" />
      <path d="M8 8c2 34 12 60 34 78" />
      <path d="M40 12c10 6 16 14 18 26M12 40c6 10 14 16 26 18" />
      {/* small blossoms along the stems */}
      <g>
        <circle cx="86" cy="42" r="6" />
        <circle cx="98" cy="46" r="4" />
        <circle cx="42" cy="86" r="6" />
        <circle cx="46" cy="98" r="4" />
        <circle cx="60" cy="60" r="7" />
      </g>
      {/* leaves */}
      <path d="M64 30c8-4 16-2 20 6-9 2-16 0-20-6ZM30 64c-4 8-2 16 6 20 2-9 0-16-6-20Z" />
    </svg>
  );
}

export function BackgroundEffects() {
  const [petals, setPetals] = useState<
    Array<{ id: number; left: number; delay: number; duration: number; size: number }>
  >([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 12,
        size: 6 + Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Floral className="absolute -top-4 -left-4 w-40 h-40 md:w-56 md:h-56 text-gold/25" />
      <Floral className="absolute -top-4 -right-4 w-40 h-40 md:w-56 md:h-56 text-gold/25 -scale-x-100" />

      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-[50%_50%_50%_0] bg-gold-soft/40 animate-petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
