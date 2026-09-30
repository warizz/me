---
description: Sync with origin/main, commit staged work on the right branch (new branch + worktree when on main), push.
---

You are committing and pushing the current work. Input: $ARGUMENTS (optional — use as commit-message / branch-name hint).

## 0. Pre-flight

- Run `git status --short` and `git branch --show-current`.
- Inspect `git diff` (and untracked files) so you know what is being committed.
- If there is nothing to commit, stop and say so.

## 1. Sync first

- `git fetch origin main`.

## 2. Branch handling

**If NOT on `main`:**

- `git merge origin/main` (do not rebase).
- On conflict: `git merge --abort`, then stop and report the conflicting files.

**If on `main`** — never commit here. Move the work to a new branch in a new worktree:

1. Pick a short kebab branch name from the changes (or $ARGUMENTS). Match repo prefixes: `perf/`, `feat/`, `notes/`, `chore/`, e.g. `feat/timecapsule-flood-sep30`.
2. `git stash push -u -m "<branch>"` (keeps untracked files).
3. `git worktree add ../me-<branch-with-dashes> -b <branch> origin/main`
   (slashes → dashes in the dir name, e.g. `feat/x` → `../me-feat-x`; this branches off the just-fetched origin/main, so no merge is needed).
4. Inside the worktree: `git stash apply` — if it fails, stop and report; the stash is intact.
5. Commit there (step 3 below). Only after a successful commit, `git stash drop`.
6. The main checkout stays on `main`, untouched. If the worktree needs a build to verify, run `pnpm install` inside it first (no node_modules there).

## 3. Stage & commit

- Stage only the files belonging to this task — never `git add -A` blindly, never commit secrets or lockfiles unrelated to the change.
- Always squash into exactly ONE commit per run — even when the changes span multiple concerns (e.g. content + tooling). If earlier commits from this run already exist on the branch, squash them first (`git reset --soft` to the branch point, then commit once).
- Commit message: conventional, matching `git log` style, lowercase, scope in parens, no trailing PR number — pick the dominant type/scope of the change, e.g. `feat(timecapsule): add sep 29–30 flood updates`.

## 4. Push

- `git push -u origin <branch>` from the worktree (plain `git push` if the branch already tracks).
- Never force-push.

## 5. Create PR (if none exists yet)

- Check with `gh pr list --head <branch> --json url`.
- No PR yet → `gh pr create --base main --title "<commit message>" --body "<short what/why + how it was verified>"`, then include the URL in the report.
- PR already exists → skip creation, include its URL in the report.

## 6. Report

Branch, commit hash + message, push result, worktree path if one was created, PR URL.
