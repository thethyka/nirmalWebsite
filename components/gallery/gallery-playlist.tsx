"use client";

import { useEffect, useRef } from "react";
import { PLAYLIST } from "@/lib/playlist";

// Mounted only inside app/gallery/page.tsx, so Next.js unmounts it (pausing
// the audio) as soon as the user navigates elsewhere. Deliberately no
// "click to start" gate — SPECS.md §5 rules that out for the Gallery.
export function GalleryPlaylist() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || PLAYLIST.length === 0) return;

    audio.src = PLAYLIST[0].src;
    audio.play().catch(() => {
      // Autoplay blocked until the user interacts with the page; expected.
    });

    function playNext() {
      indexRef.current = (indexRef.current + 1) % PLAYLIST.length;
      if (audio) {
        audio.src = PLAYLIST[indexRef.current].src;
        audio.play().catch(() => {});
      }
    }

    audio.addEventListener("ended", playNext);
    return () => {
      audio.removeEventListener("ended", playNext);
      audio.pause();
    };
  }, []);

  return <audio ref={audioRef} className="hidden" />;
}
