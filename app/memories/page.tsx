import { sql, type Memory } from "@/lib/db";
import { BackgroundEffects } from "@/components/background-effects";
import { MemoriesFeed } from "@/components/memories/memories-feed";

export const dynamic = "force-dynamic";

export default async function MemoriesPage() {
  const memories = (await sql`
    SELECT id, name, relationship, message, personal_photo_url, created_at
    FROM "Memory"
    ORDER BY created_at DESC
  `) as Memory[];

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4">
            Memories
          </h1>
        </div>

        <MemoriesFeed initialMemories={memories} />
      </div>
    </div>
  );
}
