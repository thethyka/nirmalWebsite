import { neon } from "@neondatabase/serverless";
import { deletePhoto } from "@/lib/blob";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

export type Memory = {
  id: number;
  name: string;
  relationship: string;
  message: string;
  personal_photo_url: string | null;
  created_at: string;
};

export type GalleryPhoto = {
  id: number;
  url: string;
  contributed_by: string | null;
  created_at: string;
};

// Photos are normalized to JPEG before upload (see lib/blob.ts), so identical
// source images hash the same regardless of original filename/format,
// letting us catch re-uploads of the same picture.
export async function dedupeGalleryPhotos(contentHash: string, keepId: number) {
  const duplicates = (await sql`
    DELETE FROM "GalleryPhoto"
    WHERE content_hash = ${contentHash} AND id != ${keepId}
    RETURNING url
  `) as Pick<GalleryPhoto, "url">[];

  await Promise.all(duplicates.map((photo) => deletePhoto(photo.url).catch(() => {})));
}
