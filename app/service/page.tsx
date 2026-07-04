import { notFound } from "next/navigation";
import { Clock, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundEffects } from "../../components/background-effects";
import { isServiceVisible } from "@/lib/service-visibility";

export const dynamic = "force-dynamic";

const SCHEDULE = [
  { time: "12:00 PM", label: "Kirtan & Antim Ardaas" },
  { time: "1:00 PM", label: "Cremation" },
  { time: "7:00 PM", label: "Kirtan Bhog (Gurdwara)" },
];

export default function ServicePage() {
  if (!isServiceVisible()) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">
            Antim Ardaas
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-memorial mb-4">
            Service Details
          </h1>
          <div className="gold-divider mb-4">&#10022;</div>
          <p className="text-lg text-ink-soft tracking-wide">Tuesday 7 July 2026</p>
        </div>

        <Card className="glass-effect mb-6 animate-fade-up">
          <CardContent className="p-8">
            <ul className="space-y-5">
              {SCHEDULE.map(({ time, label }) => (
                <li key={label} className="flex items-center gap-4 text-ink">
                  <Clock size={20} className="text-gold shrink-0" />
                  <span className="font-semibold w-20 tabular-nums">{time}</span>
                  <span className="text-ink-soft">{label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-effect mb-6 animate-fade-up">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 text-ink">
              <MapPin size={20} className="text-gold shrink-0 mt-1" />
              <div>
                <p className="font-semibold font-serif text-xl">
                  Siri Guru Singh Sabha Gurdwara
                </p>
                <p className="text-ink-soft">Mombasa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect animate-fade-up">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 text-ink">
              <Phone size={20} className="text-gold shrink-0 mt-1" />
              <div>
                <p className="font-semibold font-serif text-xl">RSVP</p>
                <p className="text-ink-soft">Placeholder RSVP contact.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic mt-4">
              Placeholder text &mdash; to be replaced with the real RSVP contact.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
