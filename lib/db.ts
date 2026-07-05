import { neon } from "@neondatabase/serverless";
import { deletePhoto } from "@/lib/blob";
import { SITE_CONTENT } from "@/content";

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

// The bio lives in the "SiteContent" table once an admin edits it; until then
// (and if the row is ever missing) we fall back to the default in content.ts.
export async function getBio(): Promise<string> {
  const rows = (await sql`
    SELECT value FROM "SiteContent" WHERE key = 'bio'
  `) as { value: string }[];

  return rows[0]?.value ?? SITE_CONTENT.bio;
}

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
