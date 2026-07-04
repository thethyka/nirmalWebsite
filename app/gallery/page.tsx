import { sql, type GalleryPhoto } from "@/lib/db";
import { BackgroundEffects } from "@/components/background-effects";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { GalleryPlaylist } from "@/components/gallery/gallery-playlist";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = (await sql`
    SELECT id, url, contributed_by, created_at
    FROM "GalleryPhoto"
    ORDER BY created_at DESC
  `) as GalleryPhoto[];

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundEffects />
      <GalleryPlaylist />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            A life in pictures
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-memorial mb-4">
            Gallery
          </h1>
          <div className="gold-divider">&#10022;</div>
        </div>

        <GalleryGrid initialPhotos={photos} />
      </div>
    </div>
  );
}
