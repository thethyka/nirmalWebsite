-- Memorial site schema (SPECS.md §6). Run via `npm run db:migrate`.

CREATE TABLE IF NOT EXISTS "Memory" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  message TEXT NOT NULL,
  personal_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  contributed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE "GalleryPhoto" ADD COLUMN IF NOT EXISTS content_hash TEXT;
