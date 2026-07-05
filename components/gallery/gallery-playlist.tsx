"use client";

import { useEffect, useRef } from "react";
import { SITE_CONTENT } from "@/content";

const PLAYLIST = SITE_CONTENT.playlist;

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Mounted only inside app/gallery/page.tsx, so Next.js unmounts it (pausing
// the audio) as soon as the user navigates elsewhere. Deliberately no
// "click to start" gate — SPECS.md §5 rules that out for the Gallery.
export function GalleryPlaylist() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const orderRef = useRef<typeof PLAYLIST>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || PLAYLIST.length === 0) return;

    orderRef.current = shuffled(PLAYLIST);
    indexRef.current = 0;
    audio.src = orderRef.current[0].src;
    audio.play().catch(() => {
      // Autoplay blocked until the user interacts with the page; expected.
    });

    function playNext() {
      indexRef.current += 1;
      if (indexRef.current >= orderRef.current.length) {
        // Loop finished — reshuffle so the next pass isn't the same order.
        orderRef.current = shuffled(PLAYLIST);
        indexRef.current = 0;
      }
      if (audio) {
        audio.src = orderRef.current[indexRef.current].src;
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
