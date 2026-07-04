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

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            Service Details
          </h1>
          <p className="text-lg text-gray-700">Tuesday 7 July 2026</p>
        </div>

        <Card className="glass-effect border-2 border-pink-200 mb-8">
          <CardContent className="p-8">
            <ul className="space-y-4">
              {SCHEDULE.map(({ time, label }) => (
                <li key={label} className="flex items-center gap-3 text-gray-800">
                  <Clock size={20} className="text-purple-600 shrink-0" />
                  <span className="font-semibold">{time}</span>
                  <span>&mdash; {label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-pink-200 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-3 text-gray-800">
              <MapPin size={20} className="text-purple-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold">Siri Guru Singh Sabha Gurdwara</p>
                <p>Mombasa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 border-pink-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-3 text-gray-800">
              <Phone size={20} className="text-purple-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold">RSVP</p>
                <p>Placeholder RSVP contact.</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic mt-4">
              Placeholder text &mdash; to be replaced with the real RSVP contact.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
