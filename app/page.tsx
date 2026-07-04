"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundEffects } from "../components/background-effects";
import { ArrowRight, Gift, Sparkles, Heart } from "lucide-react";

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div
          className={`text-center mb-16 ${
            showContent ? "animate-bounce-in" : "opacity-0"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-gradient mb-4">
              Happy Birthday
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-purple-600 animate-bounce">
              Sashah! 🎉
            </h2>
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <Gift className="text-pink-500 animate-spin" size={32} />
            <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl whitespace-pre-line">
              {
                "✨ Happy 24th! ✨ \n\n Please enjoy this birthday website made just for you.\nWe hope you visit this page if you ever need a reminder of just how much you are loved 💕"
              }
            </p>
            <Gift className="text-purple-500 animate-spin" size={32} />
          </div>

          <div className="text-6xl md:text-8xl animate-bounce mb-8">🎂🎈🎊</div>
        </div>

        {/* Welcome Message */}
        <Card
          className={`max-w-4xl mx-auto mb-16 glass-effect border-2 border-pink-200 ${
            showContent ? "animate-slide-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.3s" }}
        ></Card>

        {/* Birthday Countdown or Age Celebration */}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="inline-flex items-center gap-2">
            <span>Made with</span>
            <Heart className="text-pink-500" size={16} />
            <span>by</span>
            <span className="font-semibold">Filip</span>
            <span>•</span>
            <span className="font-semibold">Vyv</span>
            <span>•</span>
            <span className="font-semibold">Karam</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
