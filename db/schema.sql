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

-- Manual display order set via the /order page. NULL = not yet placed; those
-- photos sort after the ordered ones (see the gallery query in app/gallery/page.tsx).
ALTER TABLE "GalleryPhoto" ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Editable site copy (currently just the bio), keyed by name. When a key is
-- absent the app falls back to the default in content.ts (see lib/db.ts getBio).
CREATE TABLE IF NOT EXISTS "SiteContent" (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
