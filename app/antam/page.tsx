import { Card, CardContent } from "@/components/ui/card";
import { BackgroundEffects } from "../../components/background-effects";
import { SITE_CONTENT } from "@/content";

// Accepts a bare video ID, a full watch URL, a youtu.be link, or an embed URL,
// and returns just the 11-character video ID (or "" if nothing usable).
function extractYoutubeId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const match = trimmed.match(
    /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/,
  );
  if (match) return match[1];
  return /^[A-Za-z0-9_-]{11}$/.test(trimmed) ? trimmed : "";
}

export default function AntamPage() {
  const youtubeId = extractYoutubeId(SITE_CONTENT.antam.youtubeId);

  return (
    <div className="min-h-screen pt-20 md:pt-24 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            A final tribute
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-memorial leading-tight pb-1 mb-4">
            Antam
          </h1>
          <div className="gold-divider mb-4">&#10022;</div>
          <p className="text-lg text-ink-soft tracking-wide">
            A recording of the Antam Sanskar held in his memory.
          </p>
        </div>

        <Card className="glass-effect animate-fade-up">
          <CardContent className="p-4 md:p-6">
            {youtubeId ? (
              <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title="Antam Sanskar for Dr. Nirmal Singh Ahluwalia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex items-center justify-center aspect-video rounded-lg bg-secondary/40 text-center">
                <p className="text-ink-soft italic px-6">
                  The Antam Sanskar recording will be available here shortly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
