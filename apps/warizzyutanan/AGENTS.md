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
