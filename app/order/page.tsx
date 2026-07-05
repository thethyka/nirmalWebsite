import { sql, type GalleryPhoto } from "@/lib/db";
import { BackgroundEffects } from "@/components/background-effects";
import { OrderGrid } from "@/components/gallery/order-grid";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  // Show photos in the current saved order so you can pick up where you left off.
  const photos = (await sql`
    SELECT id, url, contributed_by, created_at
    FROM "GalleryPhoto"
    ORDER BY sort_order ASC NULLS LAST, created_at DESC
  `) as GalleryPhoto[];

  return (
    <div className="min-h-screen pt-20 md:pt-24 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            Arrange the gallery
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-memorial mb-4">
            Order Photos
          </h1>
          <div className="gold-divider">&#10022;</div>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Click the photos one by one in the order you want them to appear in
            the gallery. Click a numbered photo again to remove it. When
            you&apos;re happy, press Save.
          </p>
        </div>

        <OrderGrid initialPhotos={photos} />
      </div>
    </div>
  );
}
