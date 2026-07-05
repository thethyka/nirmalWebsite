# Issues: build order

Local tracking checklist, not GitHub issues. Work top to bottom — each depends on the ones above it. Functionality first, rough/default styling; the full visual design pass (§11) happens last, once every page works.

Check an item's box only after it's been verified (built + actually exercised, not just "code written").

Once an item is marked DONE, add a **Context** note under it: standing facts someone would need to know to work on later issues (resource/project names, non-default choices still in effect, constraints that must not be silently undone) — not a log of what happened or problems hit along the way. Never put actual secret values in it.

## 0. Repo cleanup — delete legacy birthday content DONE
- Delete: `public/people/`, `public/people.json`, `public/groupImages/`, `public/gallery-images.json`, `public/birthday-song.mp3`, `public/shitbirthday-song.mp3`, `birthday-website.tsx`, `public/CNAME`, `scripts/generatePeopleData.js`, `scripts/generateGalleryImages.js`, `app/peeeeeeeeeple/`, `app/video/`.
- Strip `generate:people` / `generate:gallery` from `package.json` scripts.
- **Verify**: `npm run dev` starts clean with no references to deleted files/scripts.
- **Context**:
  - `components/navigation.tsx` (links to deleted `/peeeeeeeeeple`, `/video`), `components/music-provider.tsx` (references deleted `birthday-song.mp3`), and `app/gallery/page.tsx` (fetches deleted `gallery-images.json`/`groupImages/`) still point at removed files — left broken on purpose, to be replaced wholesale by Issues 4 (nav) and 7 (gallery), not patched piecemeal now.
  - App is still fully birthday-themed (page titles, copy, purple/pink palette) — untouched until the relevant page issues and the Issue 11 design pass.

## 1. Project infra — live app, not static export DONE
- Remove `output: 'export'` from `next.config.js`/`.mjs` (reconcile the duplicate configs into one).
- `vercel link` the repo to a Vercel project; provision Neon Postgres + Vercel Blob via Marketplace.
- Env vars scaffolded locally (`vercel env pull`) and in Vercel (Postgres connection string, Blob token, gate passwords).
- **Verify**: `next build` succeeds as a server app (no export step); a bare deploy to a Vercel preview URL loads the default page.
- **Context**:
  - Vercel project: `dr-nirmal-singh-ahluwalia` under team scope `thethykas-projects`.
  - `next.config.js` is the single config file (`.mjs` removed).
  - Blob store (`nirmal-memorial-media`) is **public** access — Gallery/playlist files render directly via `<img>`/`<audio>` src URLs; the site's own password gate (Issue 3) is the intended access control, not Blob-level privacy.
  - This project builds with npm — no `pnpm-lock.yaml`.
  - Vercel's default "Vercel Authentication" (SSO) deployment protection is disabled for this project, so the production URL is reachable without a Vercel account. Don't re-enable it without also solving guest access another way.
  - Gate passwords are real (not placeholders): guest = `WeLoveNirmal`, admin password chosen by the user. Both live only in Vercel env vars (`GUEST_PASSWORD`, `ADMIN_PASSWORD`) and gitignored `.env.local`.

## 2. Data layer DONE
- Neon schema: `Memory` and `GalleryPhoto` tables per SPECS §6.
- Migration approach (Drizzle or plain SQL — pick one, keep it simple).
- Blob upload helper (server-side) for photos.
- **Verify**: a script or temporary route can insert/read a row and upload/fetch a Blob file against the real Neon/Blob instances.
- **Context**:
  - Plain SQL, no ORM: schema lives in `db/schema.sql` (two `CREATE TABLE IF NOT EXISTS` statements, quoted identifiers `"Memory"`/`"GalleryPhoto"` — queries against them must quote the names too). Applied via `npm run db:migrate`, which reads that file and runs each statement through `@neondatabase/serverless`. Re-running is safe (idempotent).
  - `lib/db.ts` exports `sql`, a ready-to-use tagged-template query client built from `DATABASE_URL`. Import this in server code/route handlers rather than constructing a new client.
  - `lib/blob.ts` exports `uploadPhoto(filename, file)` — wraps `@vercel/blob`'s `put`, stores under a `photos/` prefix with `access: "public"` and a random suffix, returns the public URL. This is the one helper both the Memories form (personal photo, photos-of-him) and the Gallery "+"/admin upload (Issues 7–9) should call.
  - `db:migrate` needs env vars that Next.js loads automatically but standalone scripts don't: it runs via `node --env-file=.env.local` with `TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}'` (the repo's `tsconfig.json` targets `esnext`, which breaks plain `ts-node/register` — force commonjs for one-off scripts run this way).
  - Verified end-to-end against the real Neon DB and Blob store (insert/read a Memory row, upload/fetch a Blob file, insert a GalleryPhoto row) via a throwaway script, since deleted — not part of the app.

## 3. Entry gate DONE
- Single password screen; guest password → session cookie unlocking public site; admin password → session cookie unlocking admin view. Wrong password → generic error.
- Middleware gating all routes until a valid session cookie is present.
- **Verify**: fresh browser (no cookie) is blocked everywhere; guest password unlocks public pages only; admin password reaches the admin view with no nav link/URL hint required.
- **Context**:
  - New env var `SESSION_SECRET` (32-byte random base64) added to `.env.local` — **not yet set in Vercel's prod/preview env**, needs `vercel env add SESSION_SECRET` before deploying past this point, or the gate will 500 in production.
  - `middleware.ts` (project root) redirects any request without a valid session cookie to `/gate`, except `/gate`, `/api/gate`, `_next/*`, and common static file extensions. This will also gate future API routes (Memories/Gallery submissions) automatically — no extra wiring needed there.
  - Session cookie `nirmal_session` (`lib/session.ts`) is a self-signed token (`role.expiresAtMs.hmacSignature`, HMAC-SHA256 via Web Crypto, no server-side session store), httpOnly, ~60 days. `role` is `"guest"` or `"admin"`; middleware also forwards it as an `x-session-role` request header for downstream pages to read.
  - There is no admin *view* yet — issue 9 still needs to build it. Right now the admin password just yields a session with `role=admin`; nothing currently branches on it. Pages built in issues 4–8 should treat `x-session-role: admin` as "also let this render" rather than gating admin-only, since admins need to see the public pages too.
  - `/gate` is a real (unlisted) route and `/api/gate` a real POST endpoint — both intentionally reachable without a cookie, since that's the only way to ever get one.

## 4. Navigation shell DONE
- Nav shows Home, Gallery, Memories. No admin link ever.
- **Verify**: nav renders correctly for guest session.
- **Context**:
  - `components/navigation.tsx` hides itself entirely on `/gate` (`pathname === "/gate"` → render `null`) — it was previously rendering above the password screen.
  - Nav brand text changed from the old birthday title to "Dr. Nirmal Singh Ahluwalia".
  - Nav is identical for guest and admin sessions (no role check) per Issue 3's context — admins see the same public nav, no admin-only link is ever rendered.
  - Originally also showed a conditionally-visible "Service" link (date-gated via `lib/service-visibility.ts`); both were removed — see Issue 6.

## 5. Home page DONE
- His photo + life summary text (placeholder copy/image until supplied — see open items).
- Rough layout only, default styling.
- **Verify**: page renders with placeholder content, no broken layout.
- **Context**:
  - `app/page.tsx` fully replaced (was still the old birthday hero) with a rough bio layout: name/dates header, photo card, life-summary card. Both the photo (`public/placeholder-user.jpg`) and the summary paragraph are explicitly labeled "Placeholder" in-page so it's obvious real content (Issue open items) hasn't landed yet — swap the `Image` src and the paragraph text in `app/page.tsx` once the family supplies them, nothing else to wire up.
  - `app/layout.tsx` metadata (`title`/`description`) also updated off the old "Happy Birthday Sashah" text to the memorial name — this was shared root metadata, not page-specific, so fixing it here to stop every page showing the birthday title in the browser tab.
  - Still on the birthday purple/pink `glass-effect`/`animate-*` styling shared with the rest of the site, per Issue 0/4 — untouched until Issue 11.

## 6. Service page REMOVED
- Originally: funeral logistics content from SPECS §5 (times, gurdwara, RSVP contact), auto-hiding via a date check.
- **Context**:
  - Removed entirely at the user's request — no longer required. `app/service/`, `lib/service-visibility.ts`, the conditional "Service" nav link (Issue 4), and the `rsvp` field in `content.ts` were all deleted; nothing references them anymore.
  - If a Service-style page is ever needed again, it isn't a matter of un-deleting — `isServiceVisible()`'s hardcoded 7 July 2026 cutoff is now in the past, so any revival would need a fresh date check.

## 7. Gallery page — functionality DONE
- Grid of GalleryPhoto rows from DB/Blob; lightbox on click.
- Low-visibility "+" button for guest photo contributions (writes to GalleryPhoto with `contributed_by`).
- Background playlist: 5–10 tracks (placeholder audio until supplied), auto-advance, loop, plays only while on page, stops on navigation away, no gate modal.
- **Verify**: uploading via "+" shows up in the grid; lightbox opens/closes; audio starts on page entry and stops on leaving the page.
- **Context**:
  - `app/gallery/page.tsx` is now a server component (`export const dynamic = "force-dynamic"`) that queries `"GalleryPhoto"` directly via `lib/db.ts`'s `sql` and hands the rows to `components/gallery/gallery-grid.tsx` (grid + lightbox + the "+" upload dialog, all client-side).
  - `app/api/gallery/route.ts` (`POST`) is the one upload endpoint: takes multipart `photo` (required) + `contributed_by` (optional text), calls `lib/blob.ts`'s `uploadPhoto`, inserts the `GalleryPhoto` row, returns it. Already gated by the existing session middleware (no extra auth wiring). Issue 9's admin upload should reuse this same route rather than adding a second one.
  - The "+" button sits at `bottom-6 right-6` (not `left-6`) — deliberately, since the Next.js dev-tools badge occupies bottom-left in dev and physically intercepts clicks there; harmless in production but kept right-side to avoid the conflict.
  - Removed `components/music-provider.tsx` and its use in `app/layout.tsx` entirely. It was a site-wide "Start the Party!" modal gate (sitting above every page, including `/gate` itself) pointing at the already-deleted `birthday-song.mp3` — directly incompatible with this issue's "no gate modal" playlist requirement. Music is now handled solely by `components/gallery/gallery-playlist.tsx`, mounted only inside the Gallery page tree, so Next unmounts (pauses) it automatically on navigation away.
  - Playlist track list lives in `lib/playlist.ts` (`PLAYLIST` array of `{ title, src }`), pointing at `public/playlist/track-1.mp3` … `track-6.mp3` — 6 short placeholder tone clips (ffmpeg-generated sine waves), not real songs. Swap the files in `public/playlist/` and update `lib/playlist.ts` once the real 5–10 tracks are supplied (SPECS §8 open item); no other code needs to change.
  - Verified against the real Neon/Blob instances (not a mock): logged in via `/api/gate`, uploaded a real image through `/api/gallery`, confirmed it rendered in the grid, then deleted the test row + Blob file so no test data was left behind.

## 8. Memories page — functionality DONE
- Scrolling feed of Memory cards, newest visible without pagination/counter.
- "Write a Memory" form: name, relationship, personal photo (optional), message, photos of him (optional) — in that order.
- Instant publish (no approval queue); "photos of him" write into GalleryPhoto, personal photo stays attached only to the Memory.
- **Verify**: submitting a Memory immediately appears in the feed; any "photos of him" submitted immediately appear in the Gallery; personal photo does not.
- **Context**:
  - `app/memories/page.tsx` is a server component (`export const dynamic = "force-dynamic"`) querying `"Memory"` directly via `lib/db.ts`'s `sql`, handing rows to `components/memories/memories-feed.tsx` (feed + "Write a Memory" dialog form, client-side) — same split pattern as Issue 7's Gallery.
  - `app/api/memories/route.ts` (`POST`) is the one submission endpoint: multipart fields `name`, `relationship`, `message` (all required), `personal_photo` (optional single file), `photos_of_him` (optional, repeatable file field). Inserts one `Memory` row (with `personal_photo_url` if provided) and, separately, one `GalleryPhoto` row per "photos of him" file (`contributed_by` set to the submitter's name) — reuses `lib/blob.ts`'s `uploadPhoto` for both, same helper Issue 7 established. Already gated by the existing session middleware.
  - The two photo concepts stay fully separate at the data layer, not just in the UI: personal photo only ever lands in `Memory.personal_photo_url`, "photos of him" only ever land as their own `GalleryPhoto` rows — neither path writes to both tables.
  - Verified against the real Neon/Blob instances (not a mock): logged in via `/api/gate`, submitted a real Memory with both a personal photo and a "photo of him" through `/api/memories`, confirmed the memory appeared in the `/memories` feed and the photo-of-him (not the personal photo) appeared in `/gallery`, then deleted the test Memory row, GalleryPhoto row, and both Blob files so no test data was left behind.

## 9. Admin view DONE
- Edit a Memory's name/relationship/message in place.
- Delete a Memory (all fields incl. personal photo removed).
- Delete any GalleryPhoto.
- Upload new GalleryPhoto (same upload path as §7's "+" button, admin-attributed).
- **Verify**: each of the four actions performed against real data and confirmed to persist after a page reload.
- **Context**:
  - `app/admin/page.tsx` — server component at the real but unadvertised `/admin` route. Checks `x-session-role` via `next/headers` `headers()`; anything other than `"admin"` gets `notFound()` (a genuine 404, not just a redirect), so a guest hitting the URL directly sees no hint an admin view exists. Renders `components/admin/admin-panel.tsx` (client) with the Memories list (inline edit/delete) and Gallery grid (delete + upload).
  - Fixed a real bug in `middleware.ts` while building this: it previously set `x-session-role` only on the outgoing **response** headers (`NextResponse.next()` then `response.headers.set(...)`), which Next.js does not forward to `headers()` in Server Components/Route Handlers — only response headers set via `NextResponse.next({ request: { headers } })` are. Nothing before Issue 9 read that header, so this went unnoticed until now. All downstream admin checks depend on this fix.
  - `app/api/memories/[id]/route.ts` (`PATCH`/`DELETE`) and `app/api/gallery/[id]/route.ts` (`DELETE`) are new, admin-only endpoints — each checks `x-session-role === "admin"` itself (403 otherwise) rather than relying on middleware, since the existing middleware only gates "has a session" not "is admin". `lib/blob.ts` gained `deletePhoto(url)` (wraps `@vercel/blob`'s `del`) so deletes also remove the underlying Blob file, not just the DB row.
  - Admin's gallery upload reuses the existing `POST /api/gallery` route exactly as Issue 7 anticipated — the admin panel just always sends `contributed_by=Admin`, no new upload endpoint.
  - Verified against the real Neon/Blob instances (not a mock): logged in via `/api/gate` with both passwords, confirmed guest gets a 404 on `/admin` and 403 on the new PATCH/DELETE endpoints, then as admin created/edited/deleted a test Memory (with personal photo) and a test GalleryPhoto through the real endpoints, confirming edits persisted across a reload and deletes removed both the DB row and the Blob file (checked with `@vercel/blob`'s `head`, since the CDN briefly still 200s a just-deleted URL from cache). No test data left behind afterward.

## 10. Deployment / go-live
- Point `drnirmalsinghahluwalia.com` at the Vercel project (DNS from user).
- Production env vars set (real passwords, DB, Blob).
- Seed initial Gallery photos from Google Drive; load real bio text/photo; load real playlist tracks.
- **Verify**: full smoke test on the live domain — gate, all four pages, submit a real Memory, admin edit/delete, playlist plays.

## 11. Design pass (last)
- Full visual restyle across all pages to the funeral-card palette (soft sky blue, white, gold, Khanda, floral framing), workshopped live per SPECS §1.
- **Verify**: visual review against the funeral card reference, checked on mobile + desktop.

---

### Open inputs still blocking full completion (SPECS §8)
Bio text, his photo, gate passwords, playlist tracks, Google Drive photo batch, domain DNS — flagged inline above where they block a step; placeholders used until supplied so functionality isn't blocked.
