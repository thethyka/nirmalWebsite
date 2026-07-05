"use client";

import { useRef, useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import type { Memory } from "@/lib/db";

export function MemoriesFeed({ initialMemories }: { initialMemories: Memory[] }) {
  const [memories, setMemories] = useState(initialMemories);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [personalPhoto, setPersonalPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [photosOfHim, setPhotosOfHim] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const personalPhotoRef = useRef<HTMLInputElement>(null);
  const photosOfHimRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !message.trim()) {
      setError("Name, relationship, and message are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("relationship", relationship.trim());
      if (personalPhoto) formData.append("personal_photo", personalPhoto);
      formData.append("message", message.trim());
      if (photosOfHim) {
        for (const photo of Array.from(photosOfHim)) {
          formData.append("photos_of_him", photo);
        }
      }

      const res = await fetch("/api/memories", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setMemories((prev) => [data.memory as Memory, ...prev]);
      setOpen(false);
      setName("");
      setRelationship("");
      setPersonalPhoto(null);
      setMessage("");
      setPhotosOfHim(null);
      if (personalPhotoRef.current) personalPhotoRef.current.value = "";
      if (photosOfHimRef.current) photosOfHimRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-center mb-12">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="px-8 py-6 text-lg rounded-full shadow-md ring-1 ring-gold/40">
              <Heart className="mr-2" size={18} />
              Write a Memory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Memory</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memory-name">Name</Label>
                <Input
                  id="memory-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jyoti"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-relationship">Relationship to Nirmal</Label>
                <Input
                  id="memory-relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Granddaughter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-personal-photo">Your photo (optional)</Label>
                <Input
                  id="memory-personal-photo"
                  type="file"
                  accept="image/*"
                  ref={personalPhotoRef}
                  onChange={(e) => setPersonalPhoto(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-message">Message</Label>
                <Textarea
                  id="memory-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a memory..."
                  rows={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-photos-of-him">Photos of him (optional)</Label>
                <Input
                  id="memory-photos-of-him"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={photosOfHimRef}
                  onChange={(e) => setPhotosOfHim(e.target.files)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {memories.length === 0 && (
          <p className="text-center text-muted-foreground">
            No memories yet. Be the first to share one.
          </p>
        )}
        {memories.map((memory) => (
          <Card key={memory.id} className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-5">
                {memory.personal_photo_url && (
                  <img
                    src={memory.personal_photo_url}
                    alt=""
                    className="w-24 h-24 rounded-full object-cover flex-shrink-0 ring-2 ring-gold-soft/60"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif text-xl font-semibold text-primary">
                      {memory.name}
                    </span>
                    <span className="text-sm text-gold">{memory.relationship}</span>
                  </div>
                  <p className="mt-2 text-ink leading-relaxed whitespace-pre-wrap">
                    {memory.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
