import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundEffects } from "../components/background-effects";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            Dr. Nirmal Singh Ahluwalia
          </h1>
          <p className="text-lg text-gray-700">27 September 1939 &ndash; 28 June 2026</p>
        </div>

        <Card className="glass-effect border-2 border-pink-200 mb-8">
          <CardContent className="p-8 flex flex-col items-center">
            <Image
              src="/placeholder-user.jpg"
              alt="Dr. Nirmal Singh Ahluwalia"
              width={200}
              height={200}
              className="rounded-full object-cover mb-2"
            />
            <p className="text-sm text-gray-500 italic">
              Placeholder photo &mdash; to be replaced with his actual photo.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-pink-200">
          <CardContent className="p-8">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {
                "Placeholder life summary text.\n\nThis will be replaced with the life summary written by the family. For now, this space holds a paragraph or two describing Dr. Nirmal Singh Ahluwalia's life, so the page layout can be verified before the real text is supplied."
              }
            </p>
            <p className="text-sm text-gray-500 italic mt-4">
              Placeholder text &mdash; to be replaced with the life summary from the family.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
