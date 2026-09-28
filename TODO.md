# TODO

- [ ] timecapsule: personal side notes — `>` blockquotes inside a node render as
      a distinct "✎ me" chip (dashed rose/amber border), so first-person
      commentary stays visually separate from the AI-summary facts. Media in
      notes: photos via existing syntax, videos via `![alt](...clip.mp4
      "YYYY-MM-DD")` → `<video controls muted playsinline>` + datestamp badge.
      Design was prototyped on 2026-09-28 and reverted pending real content
      (first note + own footage). Touch points: `EventTimeline.tsx`
      (bodyClass + video branch), `Markdown.tsx` (video component),
      `photo-id.css` (blockquote chip), `INSTRUCTIONS.md`.
