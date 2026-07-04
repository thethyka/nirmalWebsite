"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  toggleMusic: () => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!showPrompt) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay prevented by browser");
        });
        setIsPlaying(true);
        setShowControls(true);
      }
    }
  }, [showPrompt]);

  const handleStart = () => {
    setShowPrompt(false);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <MusicContext.Provider
      value={{ isPlaying, isMuted, toggleMusic, toggleMute }}
    >
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          const el = e.currentTarget as HTMLAudioElement;
          console.warn("Failed to load birthday song. Tried src:", el.currentSrc);
        }}
      >
        {/* Ensure correct path on GitHub Pages (basePath = /birthday). */}
        <source src="/birthday-song.mp3" type="audio/mpeg" />
      </audio>

      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs text-center border-4 border-pink-200 animate-bounce-in">
            <div className="text-5xl mb-4">🎉🎂✨</div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">
              Ready to Celebrate?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Click below to start the party and play your birthday song! 🥳
            </p>
            <Button
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition-transform"
              onClick={handleStart}
              autoFocus
            >
              Start the Party!
            </Button>
          </div>
        </div>
      )}

      {showControls && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <div className="glass-effect rounded-full p-3 shadow-lg">
            <Music className="text-purple-600 animate-pulse" size={20} />
          </div>
          <Button
            onClick={toggleMusic}
            size="sm"
            className="glass-effect hover:bg-white/40 text-purple-600 border-0 rounded-full w-12 h-12 p-0"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button
            onClick={toggleMute}
            size="sm"
            className="glass-effect hover:bg-white/40 text-purple-600 border-0 rounded-full w-12 h-12 p-0"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
        </div>
      )}

      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
