"use client";

import { useRef, useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import type { Memory, GalleryPhoto } from "@/lib/db";

function EditMemoryForm({
  memory,
  onSaved,
  onCancel,
}: {
  memory: Memory;
  onSaved: (memory: Memory) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(memory.name);
  const [relationship, setRelationship] = useState(memory.relationship);
  const [message, setMessage] = useState(memory.message);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/memories/${memory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship: relationship.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved(data.memory as Memory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={`edit-name-${memory.id}`}>Name</Label>
        <Input
          id={`edit-name-${memory.id}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`edit-relationship-${memory.id}`}>Relationship</Label>
        <Input
          id={`edit-relationship-${memory.id}`}
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`edit-message-${memory.id}`}>Message</Label>
        <Textarea
          id={`edit-message-${memory.id}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function BioAdmin({ initialBio }: { initialBio: string }) {
  const [bio, setBio] = useState(initialBio);
  const [saved, setSaved] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setStatus("idle");
    try {
      const res = await fetch("/api/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bio.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setBio(data.bio as string);
      setSaved(data.bio as string);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const dirty = bio.trim() !== saved.trim();

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="admin-bio">Biography</Label>
            <Textarea
              id="admin-bio"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setStatus("idle");
              }}
              rows={16}
              required
            />
            <p className="text-xs text-muted-foreground">
              Shown on the home page. Blank lines separate paragraphs.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {status === "success" && !dirty && (
            <p className="text-sm text-gold">Biography saved.</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving || !dirty}>
              {saving ? "Saving..." : "Save"}
            </Button>
            {dirty && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBio(saved);
                  setStatus("idle");
                  setError(null);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function MemoriesAdmin({
  initialMemories,
}: {
  initialMemories: Memory[];
}) {
  const [memories, setMemories] = useState(initialMemories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setDeleteError("Failed to delete memory.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
      {memories.length === 0 && (
        <p className="text-center text-muted-foreground">No memories yet.</p>
      )}
      {memories.map((memory) => (
        <Card key={memory.id} className="glass-effect">
          <CardContent className="p-6">
            {editingId === memory.id ? (
              <EditMemoryForm
                memory={memory}
                onCancel={() => setEditingId(null)}
                onSaved={(updated) => {
                  setMemories((prev) =>
                    prev.map((m) => (m.id === updated.id ? updated : m))
                  );
                  setEditingId(null);
                }}
              />
            ) : (
              <div className="flex items-start gap-4">
                {memory.personal_photo_url && (
                  <img
                    src={memory.personal_photo_url}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif text-lg font-semibold text-primary">
                      {memory.name}
                    </span>
                    <span className="text-sm text-gold">{memory.relationship}</span>
                  </div>
                  <p className="mt-2 text-ink whitespace-pre-wrap">{memory.message}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => setEditingId(memory.id)}>
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingId === memory.id}
                        >
                          {deletingId === memory.id ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this memory?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {memory.name}&rsquo;s memory, including any personal
                            photo, will be permanently removed. This cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(memory.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GalleryAdmin({
  initialPhotos,
}: {
  initialPhotos: GalleryPhoto[];
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("Choose at least one photo first.");
      return;
    }
    setUploading(true);
    setError(null);
    const failed: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress({ done: i, total: files.length });
      try {
        const formData = new FormData();
        formData.append("photo", files[i]);
        formData.append("contributed_by", "Admin");
        const res = await fetch("/api/gallery", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setPhotos((prev) => [data.photo as GalleryPhoto, ...prev]);
      } catch {
        failed.push(files[i].name);
      }
    }

    setProgress(null);
    setUploading(false);
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (failed.length > 0) {
      setError(`Failed to upload: ${failed.join(", ")}`);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete photo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="flex items-end gap-3 flex-wrap">
        <div className="space-y-1">
          <Label htmlFor="admin-gallery-photo">Add photos</Label>
          <Input
            id="admin-gallery-photo"
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </div>
        <Button type="submit" disabled={uploading || files.length === 0}>
          {uploading
            ? `Uploading ${(progress?.done ?? 0) + 1} of ${progress?.total ?? files.length}...`
            : files.length > 0
              ? `Upload ${files.length} photo${files.length === 1 ? "" : "s"}`
              : "Upload"}
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">No photos yet.</p>
        )}
        {photos.map((photo) => (
          <Card
            key={photo.id}
            className="glass-effect overflow-hidden relative"
          >
            <CardContent className="p-0">
              <img src={photo.url} alt="" className="w-full h-40 object-cover" />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    aria-label="Delete photo"
                    disabled={deletingId === photo.id}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove it from the Gallery for everyone. This
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(photo.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {photo.contributed_by && (
                <p className="text-xs text-muted-foreground px-2 py-1 truncate">
                  {photo.contributed_by}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminPanel({
  initialMemories,
  initialPhotos,
  initialBio,
}: {
  initialMemories: Memory[];
  initialPhotos: GalleryPhoto[];
  initialBio: string;
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section>
        <h2 className="font-serif text-2xl font-semibold text-primary mb-4">Biography</h2>
        <BioAdmin initialBio={initialBio} />
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold text-primary mb-4">Memories</h2>
        <MemoriesAdmin initialMemories={initialMemories} />
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold text-primary mb-4">Gallery</h2>
        <GalleryAdmin initialPhotos={initialPhotos} />
      </section>
    </div>
  );
}
