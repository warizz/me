---
description: Put current changes on a branch as ONE conventional commit, push, open a PR to main. Squash-only.
---

You are shipping a PR for the repo at ~/works/me (default branch: `main`).

Input: $ARGUMENTS (optional: commit message and/or branch name).
If not given, derive both from the diff (`git status` + `git diff`), following
the message rules below, and confirm with the user before committing.

Workflow:

1. `git fetch --prune`. If on `main`: create a branch first —
   `git checkout main && git pull --rebase --autostash && git checkout -b <branch>`
   (uncommitted changes come along). If already on a feature branch, stay.
   Branch name: from input, else `<type>/<short-topic>` (e.g. `feat/notes-tldr`).
2. Ensure EXACTLY ONE commit on the branch:
   - If the branch has local commits beyond `main` (or a PR already exists),
     squash them: `git reset --soft $(git merge-base main HEAD)` then commit
     everything as one.
   - `git add -A && git commit -m "<message>"`
   - Never push secret/debug leftovers; review `git status` + `git diff --staged` first.
3. Push: `git push -u origin <branch>` (use `--force-with-lease` after a squash
   of already-pushed commits).
4. Open the PR with `gh pr create --base main --title "<message>"` and a short
   body (what + why). Return the PR URL.
5. Merging is done with squash strategy only (`gh pr merge --squash`), and only
   when the user asks.

Commit message rules (conventional commits, matching repo history):

- Format: `<type>(<scope>)!: <subject>` — `!` and scope only when appropriate.
- Types: feat, fix, chore, docs, refactor, test. Scope = app or area
  (e.g. `feat(notes): add tldr subtitle to notes index`).
- Subject: lowercase, imperative, no trailing period.

Verify before committing if app code changed:
`pnpm --filter warizzyutanan lint && pnpm --filter warizzyutanan tsc`
(skip for content/markdown-only changes).
