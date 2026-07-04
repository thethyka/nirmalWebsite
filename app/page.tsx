import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundEffects } from "../components/background-effects";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            In loving memory
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-memorial mb-4">
            Dr. Nirmal Singh Ahluwalia
          </h1>
          <div className="gold-divider mb-4">&#10022;</div>
          <p className="text-lg text-ink-soft tracking-wide">
            27 September 1939 &ndash; 28 June 2026
          </p>
        </div>

        <Card className="glass-effect mb-8 animate-fade-up">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="rounded-full p-1.5 bg-gradient-to-b from-gold-soft to-gold/40 shadow-md">
              <Image
                src="/placeholder-user.jpg"
                alt="Dr. Nirmal Singh Ahluwalia"
                width={200}
                height={200}
                className="rounded-full object-cover ring-4 ring-white"
              />
            </div>
            <p className="text-sm text-muted-foreground italic mt-4">
              Placeholder photo &mdash; to be replaced with his actual photo.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect animate-fade-up">
          <CardContent className="p-8">
            <p className="text-ink leading-relaxed text-lg whitespace-pre-line">
              {
                "Placeholder life summary text.\n\nThis will be replaced with the life summary written by the family. For now, this space holds a paragraph or two describing Dr. Nirmal Singh Ahluwalia's life, so the page layout can be verified before the real text is supplied."
              }
            </p>
            <p className="text-sm text-muted-foreground italic mt-4">
              Placeholder text &mdash; to be replaced with the life summary from the family.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
