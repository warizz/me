# Timecapsule — Instructions

Archive of news moments worth remembering. One `.md` file per event, stored in <code>resource/content/</code> with the other content.

## Adding an event

1. Create `YYYY-MMDD-slug.md` in `resource/content/`
2. Drop photos in `public/posts/`, named `<entry-id>-<nn>-<caption>.webp`
3. Done — the index and the event route generate automatically at build

## Frontmatter

```yaml
title: "Event Title"
startDate: "YYYY-MM-DD"   # required
endDate: "YYYY-MM-DD"     # optional — omit while the event is still unfolding
publish: true
tags: [weather, bangkok]
tldr: "One-line summary for the index card."
```

No `endDate` → the badge renders "→ ongoing". Add it once the event resolves.

## Body format

- Lead paragraph: plain factual summary, no quotes
- `### Day, time — short title` = timeline node
- `## Section name` = card section (e.g. Sources)
- Facts only. Short bullets, simple words, easy to skim
- Node needing attribution: `*Sources: [Name](url)*` line at the end of the node
- Personal side note: `> ...` lines inside a node body — a collapsed-by-default
  "✎ me" disclosure with a thick dashed border sits at the bottom of that
  day's card; content mounts only when opened, so photos/videos inside load
  lazily.

## Photos

- Store as WebP (q80) — convert before committing:
  `for f in *.jpg; do cwebp -q 80 -quiet "$f" -o "${f%.jpg}.webp" && rm "$f"; done`
- Then run `pnpm gen-photos` — creates `.640w/.960w` variants + regenerates `photo-meta.ts` (srcset + dimensions)
- Markdown: `![alt](/timecapsule/<slug>/file.webp "YYYY-MM-DD")`
  - The title attribute = source publish date → badge shows `filename · date`
  - Omit the title and the badge falls back to filename only
- Every photo gets a caption line with a linked credit:
  `*Short caption. Photo: [Photographer / Outlet](article-url)*`
- Download photos locally — never hotlink (files must survive source-site churn)
- Videos: same `![alt](/timecapsule/<slug>/clip.mp4 "YYYY-MM-DD")` syntax — the
  extension switches the renderer to `<video controls muted playsinline>`. Keep
  clips short (~<5MB); they don't get srcset variants (own footage, not news media)

## Research workflow

1. Fetch candidate sources (news sites) — check dates, avoid old/unrelated events
2. Propose every candidate link AND photo to the moderator — nothing is added without approval
3. Photos: give direct image URLs for review first; watch for duplicates/duplicate crops
4. Sourcing: inline link at the end of every bullet (`— [Outlet](url)`); no separate Sources section; photo credits link their article

## Verify

After any change:

```
pnpm lint && pnpm build
```

## Notes

- Events are identified by the `timecapsule` tag in frontmatter (all content lives in `resource/content/`)
- UI chrome (layout, disclaimer, badges) lives in `layout.tsx`, `page.tsx`, `[id]/page.tsx`, `EventTimeline.tsx`, `photo-id.css` — all scoped to this folder, nothing shared outside
