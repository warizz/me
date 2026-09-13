---
description: Add a video-summary note page to the warizzyutanan site (warizzyutanan/notes). Requires a YouTube URL and pasted content.
---

You are adding a note page to the warizzyutanan site.

Input: $ARGUMENTS.
Ask the user for anything missing among these three, before doing anything:
1. Source URL (YouTube share URL; videos cannot be watched — the user must supply content)
2. Content (summary / key ideas)
3. My takes (personal note; always rewrite into natural English — the user is
   not a native speaker)

Rules:

- Repo: ~/works/me, app: apps/warizzyutanan. Notes live in
  `apps/warizzyutanan/resource/notes/`. Read one recent note first to confirm
  conventions.
- Filename: `YYYY-MM-DD-<short-kebab-topic>.md`. Date = conversation date if
  stated in the content, else today (Asia/Bangkok).
- Content (all English):
  1. `# Title` (h1 is stripped at render; the layout re-renders it)
  2. Bold `**Conversation date: ...**` line ONLY if it differs from the
     filename date (layout already shows the filename date)
  3. YouTube iframe — extract the video ID and `si` param from the URL:

     ```
     <iframe width="560" height="315"
     src="https://www.youtube.com/embed/<ID>?si=<SI>"
     title="YouTube video player" frameborder="0"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
     referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
     ```

   4. `## My takes` (plain text, no blockquote), `## Summary`, `## Key ideas`
- No code changes needed: routing, index, and sitemap derive from the
  directory listing. Do not update them.
- Verify: `pnpm --filter warizzyutanan lint && pnpm --filter warizzyutanan tsc && pnpm --filter warizzyutanan build`.
- Report: file created, route (`/notes/<filename-without-.md>`), verification results.
