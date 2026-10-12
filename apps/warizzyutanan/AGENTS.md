# AGENTS.md — warizzyutanan

## Sale page (`/sale`) data conventions

- Data lives in `resource/sale/items.yaml`; photos in `public/photos/sale/`.
- Always keep `id` and photo filenames mapped to the item `title`:
  - `id` = English slug of the title, lowercase-hyphen (`ชีวิตเรามีแค่สี่พันสัปดาห์` → `four-thousand-weeks`).
  - photos = `<id>-<n>.webp` (e.g. `four-thousand-weeks-1.webp`).
  - When a title changes, update `id` and rename the photo files (and the
    YAML `photos:` paths) in the same change.
- The page is linked from the homepage but stays out of search: never add it
  to the sitemap; it stays `noindex`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
