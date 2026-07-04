# Move from static export to a live app on Vercel with Neon + Blob

The original repo was a Next.js static export (`output: 'export'`) deployed to GitHub Pages, with all content baked in at build time from files committed to `public/`. The memorial site needs guests to submit Memories and photos live, and an admin to edit/delete them afterward — neither is possible on a build-time-only static site.

We're moving to a live Next.js app on Vercel, using Neon Postgres (Memories, Gallery photo records) and Vercel Blob (photo files), provisioned through the Vercel Marketplace. This is hard to reverse — it changes hosting, the deploy pipeline, and the data model — and was a real trade-off against staying static with Karam manually committing every guest submission to the repo, which the family rejected in favor of true self-service.
