import { readdirSync } from "fs";
import { join } from "path";

// The Gallery playlist is just whatever .mp3 files are sitting in
// public/playlist/ — drop files in (or take them out) and they're picked up
// automatically. Nothing to keep in sync elsewhere.
export function getPlaylistTracks(): string[] {
  const dir = join(process.cwd(), "public", "playlist");
  let files: string[];
  try {
    files = readdirSync(dir);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.toLowerCase().endsWith(".mp3"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `/playlist/${f}`);
}
