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

## 3. Entry gate
- Single password screen; guest password → session cookie unlocking public site; admin password → session cookie unlocking admin view. Wrong password → generic error.
- Middleware gating all routes until a valid session cookie is present.
- **Verify**: fresh browser (no cookie) is blocked everywhere; guest password unlocks public pages only; admin password reaches the admin view with no nav link/URL hint required.

## 4. Navigation shell
- Nav shows Home, Service (conditionally), Gallery, Memories. No admin link ever.
- Service link/page auto-hides from 8 July 2026 onward via date check (not manual).
- **Verify**: nav renders correctly for guest session; manually flip a test date check to confirm Service disappears after the cutoff.

## 5. Home page
- His photo + life summary text (placeholder copy/image until supplied — see open items).
- Rough layout only, default styling.
- **Verify**: page renders with placeholder content, no broken layout.

## 6. Service page
- Funeral logistics content from SPECS §5 (times, gurdwara, RSVP contact).
- Same auto-hide behavior as §4, enforced at the page level too (direct URL hit after cutoff should not show stale info as current).
- **Verify**: content matches the funeral card; page is unreachable/hidden after 7 July 2026 per the date check.

## 7. Gallery page — functionality
- Grid of GalleryPhoto rows from DB/Blob; lightbox on click.
- Low-visibility "+" button for guest photo contributions (writes to GalleryPhoto with `contributed_by`).
- Background playlist: 5–10 tracks (placeholder audio until supplied), auto-advance, loop, plays only while on page, stops on navigation away, no gate modal.
- **Verify**: uploading via "+" shows up in the grid; lightbox opens/closes; audio starts on page entry and stops on leaving the page.

## 8. Memories page — functionality
- Scrolling feed of Memory cards, newest visible without pagination/counter.
- "Write a Memory" form: name, relationship, personal photo (optional), message, photos of him (optional) — in that order.
- Instant publish (no approval queue); "photos of him" write into GalleryPhoto, personal photo stays attached only to the Memory.
- **Verify**: submitting a Memory immediately appears in the feed; any "photos of him" submitted immediately appear in the Gallery; personal photo does not.

## 9. Admin view
- Edit a Memory's name/relationship/message in place.
- Delete a Memory (all fields incl. personal photo removed).
- Delete any GalleryPhoto.
- Upload new GalleryPhoto (same upload path as §7's "+" button, admin-attributed).
- **Verify**: each of the four actions performed against real data and confirmed to persist after a page reload.

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
