"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GalleryPhoto } from "@/lib/db";

export function OrderGrid({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [photos] = useState(initialPhotos);
  // Ordered list of photo ids, in the sequence they were clicked.
  const [order, setOrder] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const positionOf = (id: number) => {
    const i = order.indexOf(id);
    return i === -1 ? null : i + 1;
  };

  const toggle = (id: number) => {
    setStatus(null);
    setOrder((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clear = () => {
    setStatus(null);
    setOrder([]);
  };

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/gallery/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: order }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus(
        `Saved. ${order.length} photo${order.length === 1 ? "" : "s"} placed — the gallery now shows this order.`
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Sticky action bar */}
      <div className="sticky top-16 md:top-20 z-30 mb-8 flex flex-wrap items-center justify-center gap-3 rounded-full glass-effect px-5 py-3">
        <span className="text-sm text-muted-foreground">
          {order.length} of {photos.length} placed
        </span>
        <Button onClick={save} disabled={saving || order.length === 0}>
          {saving ? "Saving..." : "Save order"}
        </Button>
        <Button
          variant="outline"
          onClick={clear}
          disabled={saving || order.length === 0}
        >
          Clear
        </Button>
        {status && (
          <span className="text-sm text-memorial w-full text-center">
            {status}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {photos.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No photos yet.
          </p>
        )}
        {photos.map((photo) => {
          const pos = positionOf(photo.id);
          const active = pos !== null;
          return (
            <Card
              key={photo.id}
              onClick={() => toggle(photo.id)}
              className={`relative card-hover glass-effect p-1.5 cursor-pointer overflow-hidden transition-shadow ${
                active ? "ring-2 ring-gold" : ""
              }`}
            >
              <CardContent className="p-0 overflow-hidden rounded-md">
                <img
                  src={photo.url}
                  alt=""
                  className={`w-full h-40 object-cover transition-all duration-300 ${
                    active ? "brightness-90" : "hover:scale-105"
                  }`}
                />
              </CardContent>
              {active && (
                <span className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white text-sm font-semibold shadow-md">
                  {pos}
                </span>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
