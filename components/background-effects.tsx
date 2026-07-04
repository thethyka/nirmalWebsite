"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Sparkles } from "lucide-react";

export function BackgroundEffects() {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; left: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    const colors = [
      "bg-pink-400",
      "bg-purple-400",
      "bg-yellow-400",
      "bg-red-400",
      "bg-blue-400",
    ];
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating balloons */}
      <div className="absolute top-10 left-10 animate-float">
        <div className="w-8 h-10 bg-pink-400 rounded-full shadow-lg"></div>
        <div className="w-1 h-12 bg-gray-300 mx-auto"></div>
      </div>
      <div
        className="absolute top-20 right-20 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-8 h-10 bg-purple-400 rounded-full shadow-lg"></div>
        <div className="w-1 h-12 bg-gray-300 mx-auto"></div>
      </div>
      <div
        className="absolute top-40 left-1/4 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-8 h-10 bg-yellow-400 rounded-full shadow-lg"></div>
        <div className="w-1 h-12 bg-gray-300 mx-auto"></div>
      </div>

      {/* Floating icons */}
      <Heart
        className="absolute top-32 right-1/4 text-pink-300 animate-sparkle"
        size={24}
      />
      <Heart
        className="absolute top-64 left-1/3 text-red-300 animate-sparkle"
        size={20}
        style={{ animationDelay: "1s" }}
      />
      <Star
        className="absolute top-48 right-1/3 text-yellow-400 animate-sparkle"
        size={16}
        style={{ animationDelay: "0.5s" }}
      />
      <Sparkles
        className="absolute top-80 left-1/4 text-purple-400 animate-sparkle"
        size={20}
        style={{ animationDelay: "1.5s" }}
      />

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-2 h-2 ${piece.color} animate-confetti`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
