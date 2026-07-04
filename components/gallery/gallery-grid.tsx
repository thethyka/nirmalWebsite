"use client";

import { useRef, useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/db";

export function GalleryGrid({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [selected, setSelected] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const next = () =>
    setSelected((s) => (s === null ? s : (s + 1) % photos.length));
  const prev = () =>
    setSelected((s) => (s === null ? s : s === 0 ? photos.length - 1 : s - 1));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a photo first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      if (name.trim()) formData.append("contributed_by", name.trim());
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPhotos((prev) => [data.photo as GalleryPhoto, ...prev]);
      setOpen(false);
      setName("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {photos.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No photos yet.
          </p>
        )}
        {photos.map((photo, index) => (
          <Card
            key={photo.id}
            className="card-hover glass-effect p-1.5 cursor-pointer overflow-hidden"
            onClick={() => setSelected(index)}
          >
            <CardContent className="p-0 overflow-hidden rounded-md">
              <img
                src={photo.url}
                alt=""
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {selected !== null && photos[selected] && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 p-0"
            >
              <X size={20} />
            </Button>
            {photos.length > 1 && (
              <>
                <Button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 p-0"
                >
                  <ChevronLeft size={24} />
                </Button>
                <Button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 p-0"
                >
                  <ChevronRight size={24} />
                </Button>
              </>
            )}
            <img
              src={photos[selected].url}
              alt=""
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Add a photo"
            className="fixed bottom-6 right-6 z-30 w-9 h-9 rounded-full bg-white/60 hover:bg-white text-gold border border-border flex items-center justify-center shadow-sm opacity-50 hover:opacity-100 transition-opacity"
          >
            <Plus size={16} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a photo to the gallery</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-photo">Photo</Label>
              <Input
                id="gallery-photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-name">Your name (optional)</Label>
              <Input
                id="gallery-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jyoti"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
