import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { sql, type Memory, type GalleryPhoto } from "@/lib/db";
import { BackgroundEffects } from "@/components/background-effects";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const role = (await headers()).get("x-session-role");
  if (role !== "admin") {
    notFound();
  }

  const memories = (await sql`
    SELECT id, name, relationship, message, personal_photo_url, created_at
    FROM "Memory"
    ORDER BY created_at DESC
  `) as Memory[];

  const photos = (await sql`
    SELECT id, url, contributed_by, created_at
    FROM "GalleryPhoto"
    ORDER BY created_at DESC
  `) as GalleryPhoto[];

  return (
    <div className="min-h-screen pt-20 md:pt-24 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-semibold text-memorial mb-4">
            Admin
          </h1>
          <div className="gold-divider">&#10022;</div>
        </div>

        <AdminPanel initialMemories={memories} initialPhotos={photos} />
      </div>
    </div>
  );
}
