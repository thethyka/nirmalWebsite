# Specs: Memorial Site for Dr. Nirmal Singh Ahluwalia

See [`CONTEXT.md`](./CONTEXT.md) for the domain glossary and [`docs/adr/`](./docs/adr/) for the reasoning behind the harder-to-reverse decisions below.

## 1. Who and why

**Dr. Nirmal Singh Ahluwalia** — 27.09.1939 – 28.06.2026. Son of the late Sardar Dalip Singh and Tarlochan Kaur Ahluwalia; husband of Sukhnandan; father of Jyoti, Sapna, Sandeep & Komal. Sikh tradition. Funeral: Tuesday 7 July 2026, Siri Guru Singh Sabha Gurdwara, Mombasa.

**Tone**: a warm celebration of a long, full life — not somber, not over-the-top. Visual design (colors/imagery) will be workshopped live rather than locked here, but the funeral card's palette (soft sky blue, white, gold, Khanda, floral framing) is the starting reference point.

This repo is a reused/copied birthday-website codebase being fully restyled and repurposed. All prior content (see §7) is being deleted outright, not archived.

## 2. Timeline — hard deadline

**The funeral is Tuesday 7 July 2026 — 3 days from today (2026-07-04).** All of v1 below must be live before then.

There is no v2 backlog beyond "add things later as they're ready" (a real tribute video, more gallery photos, video support in the Gallery). Nothing in v1 is a throwaway prototype — it's just a smaller surface area than the eventual full site.

## 3. Architecture

Moving off the current static-export/GitHub-Pages setup to a **live Next.js app on Vercel**:

- **Hosting**: Vercel (custom domain: `drnirmalsinghahluwalia.com`, purchased/pointed by the user)
- **Database**: Neon Postgres (via Vercel Marketplace) — Memories, Gallery photo records
- **File storage**: Vercel Blob — personal photos, Gallery photos, playlist audio files
- **No GitHub Pages, no build-time data generation** (`generatePeopleData.js` / `generateGalleryImages.js` and `output: 'export'` in `next.config.js`/`.mjs` are retired)

See [ADR 0001](./docs/adr/0001-live-app-on-vercel-with-neon-and-blob.md).

## 4. Entry gate (site-wide)

Every visitor hits a single password screen before anything else loads.

- One password field, two valid passwords:
  - **Guest password** → unlocks the public site (Home, Service, Gallery, Memories) for that browser, session cookie lasting ~30–90 days.
  - **Admin password** → unlocks the admin view instead, in the same session. No separate `/admin` URL, no nav link to it — reachable only by knowing the admin password.
- Wrong password → stay on the gate with an error, no hint about which password types exist.

See [ADR 0002](./docs/adr/0002-single-entry-gate-routes-guest-or-admin.md).

## 5. Pages

### Home (`/`)
Primarily a bio page:
- His photo
- Life summary text (written by the user's mum — content to be supplied, not invented)
- Room for a couple of small additional touches (TBD, low priority)

### Service (temporary)
- Funeral logistics from the funeral card: Kirtan & Antim Ardaas 12:00 PM, Cremation 1:00 PM, Kirtan Bhog (Gurdwara) 7:00 PM, Siri Guru Singh Sabha Gurdwara, Mombasa, RSVP contact.
- Shown in nav only through 7 July 2026; **automatically stops appearing** from 8 July 2026 onward (date check, not a manual step).

### Gallery (`/gallery`)
- Grid of photos of Nirmal's life. Sources:
  1. Seeded by the admin (uploaded via the same admin "add photo" feature, from the user's Google Drive collection)
  2. Contributed by guests via the Memories form's "photos of him" step (see §6)
  3. Contributed by guests directly via a small, low-visibility **"+" button** on the Gallery page itself — deliberately less prominent than the main "write a Memory" call to action
- Lightbox viewer (click a photo to view larger), similar to the current gallery page's modal.
- **Background music**: a playlist of 5–10 user-supplied songs, auto-advancing, **loops**. Plays only while on this page; stops immediately on navigating away. No "click to start the party" modal gate — playback is scoped to page presence, browser autoplay restrictions permitting.
- **v1 is photos only.** Video upload/playback in the Gallery is fast-follow, once an actual video exists — not built now.

### Memories (`/memories`) — renamed from "Guestbook"
- A **scrolling feed/wall** of tribute cards (not a one-at-a-time carousel), newest activity visible without needing an index counter.
- A prominent **"Write a Memory"** call-to-action opens a form with, in order:
  1. **Name** (required)
  2. **Relationship** to Nirmal (required) — e.g. "Granddaughter", "Friend from Mombasa"
  3. **Personal photo** (optional) — of themselves, or themselves with Nirmal. Shown only inside their own Memory card. Never enters the Gallery.
  4. **Message** (required) — the tribute text
  5. **Photos of him** (optional, at the end) — these flow into the shared Gallery, not just this card.
- Submissions **publish instantly** — no approval queue. The password gate is the only barrier to entry; admin can edit or delete after the fact. See [ADR 0003](./docs/adr/0003-instant-publish-delete-after-moderation.md).
- Personal photos and Gallery photos are kept strictly separate concepts — see [ADR 0004](./docs/adr/0004-gallery-and-personal-photos-are-separate.md).

### Admin (reachable only via the Entry gate's admin password — no nav link, no `/admin` route advertised anywhere)
Capabilities:
- **Delete** any Memory entirely (name, relationship, message, personal photo all removed)
- **Edit** a Memory's text (name / relationship / message) in place
- **Delete** any Gallery photo (regardless of who added it)
- **Upload** new Gallery photos (same feature used to seed the initial batch from Google Drive)

## 6. Data model (informal)

**Memory**
- `id`, `name`, `relationship`, `message`, `personal_photo_url` (nullable), `created_at`

**GalleryPhoto**
- `id`, `url`, `contributed_by` (nullable — admin upload vs. guest name if via a Memory or the Gallery "+" button), `created_at`

**Playlist**
- Static list of 5–10 audio files (no DB table needed) served from Blob or `public/`, played in sequence, looping, scoped to the Gallery page only.

No user accounts. No relational link required between a Memory's "photos of him" contribution and the resulting GalleryPhoto rows beyond `contributed_by` for context.

## 7. Disposal of existing content

The current repo is a birthday site for "Sashah" (24th birthday, credited to Filip/Vyv/Karam). All of the following are being **deleted outright**, not archived:

- `public/people/` (16 friends' birthday messages/photos) and `public/people.json`
- `public/groupImages/` and `public/gallery-images.json`
- `public/birthday-song.mp3`, `public/shitbirthday-song.mp3`
- `birthday-website.tsx` (standalone unused component)
- `public/CNAME` (`sashahbday` — replaced by the new custom domain)
- `scripts/generatePeopleData.js`, `scripts/generateGalleryImages.js` (build-time generation no longer applies)
- The `/peeeeeeeeeple` ("Besties") route and the `/video` route — their concepts are superseded by Memories and dropped respectively (video may return post-v1 once real footage exists)

The reusable parts of the codebase (Next.js + Tailwind + shadcn/ui component library, animation utility classes in `globals.css`, `BackgroundEffects`, general project scaffolding) are kept and restyled rather than rebuilt from scratch.

## 8. Open items / inputs still needed from the user

- [ ] Life summary / bio text (from mum)
- [ ] His photo for the Home page (from the funeral card, or a better source)
- [ ] Choice of guest password and admin password
- [ ] 5–10 songs for the Gallery playlist
- [ ] Initial batch of life/family photos from Google Drive (to be uploaded via the admin page once built)
- [ ] Purchase and DNS setup for `drnirmalsinghahluwalia.com`

## 9. Explicitly out of scope for now

- Video upload/playback in the Gallery (fast-follow)
- A dedicated Video page (dropped; may return once a tribute video exists)
- Any moderation/approval queue (rejected — see ADR 0003)
- Multi-user admin accounts (single shared admin password only)
