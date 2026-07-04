export type Track = {
  title: string;
  src: string;
};

// Placeholder tracks (SPECS.md §5, §8) — short tones, not real songs.
// Swap this list for the 5–10 real tracks once supplied, dropped into public/playlist/.
export const PLAYLIST: Track[] = [
  { title: "Track 1 (placeholder)", src: "/playlist/track-1.mp3" },
  { title: "Track 2 (placeholder)", src: "/playlist/track-2.mp3" },
  { title: "Track 3 (placeholder)", src: "/playlist/track-3.mp3" },
  { title: "Track 4 (placeholder)", src: "/playlist/track-4.mp3" },
  { title: "Track 5 (placeholder)", src: "/playlist/track-5.mp3" },
  { title: "Track 6 (placeholder)", src: "/playlist/track-6.mp3" },
];
