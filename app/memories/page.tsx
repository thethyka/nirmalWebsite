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
  for (let i = memories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [memories[i], memories[j]] = [memories[j], memories[i]];
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            Tributes &amp; remembrances
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-memorial mb-4">
            Memories
          </h1>
          <div className="gold-divider">&#10022;</div>
        </div>

        <MemoriesFeed initialMemories={memories} />
      </div>
    </div>
  );
}
