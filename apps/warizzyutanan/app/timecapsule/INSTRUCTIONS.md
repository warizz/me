# Timecapsule — Instructions

Archive of news moments worth remembering. One `.md` file per event, colocated with the code.

## Adding an event

1. Create `YYYY-MMDD-slug.md` in this folder
2. Drop photos in `public/timecapsule/<slug>/`
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

## Photos

- Markdown: `![alt](/timecapsule/<slug>/file.jpg "YYYY-MM-DD")`
  - The title attribute = source publish date → badge shows `filename · date`
  - Omit the title and the badge falls back to filename only
- Every photo gets a caption line with a linked credit:
  `*Short caption. Photo: [Photographer / Outlet](article-url)*`
- Download photos locally — never hotlink (files must survive source-site churn)

## Research workflow

1. Fetch candidate sources (news sites) — check dates, avoid old/unrelated events
2. Propose every candidate link AND photo to the moderator — nothing is added without approval
3. Photos: give direct image URLs for review first; watch for duplicates/duplicate crops
4. Sources section at the bottom: short label + link per source

## Verify

After any change:

```
pnpm lint && pnpm build
```

## Notes

- This file is not an event — the loader skips `INSTRUCTIONS.md` by name
- UI chrome (layout, disclaimer, badges) lives in `layout.tsx`, `page.tsx`, `[id]/page.tsx`, `EventTimeline.tsx`, `photo-id.css` — all scoped to this folder, nothing shared outside
