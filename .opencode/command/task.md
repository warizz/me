---
description: Start a coding task in an isolated git worktree — setup, brief, code, then hand off to /pr. Requires a task description.
---

You are starting a coding task in the repo at ~/works/me (default branch: `main`).

Input: $ARGUMENTS (the task description).
If the description is missing or too vague to scope (what/why/done-criteria),
interview the user before doing anything.

Workflow:

1. `git fetch --prune` in ~/works/me.
2. Derive the branch name `<type>/<short-topic>` (types: feat, fix, chore,
   docs, refactor, test; topic = short-kebab). Confirm with the user.
3. Create an isolated worktree + branch off `origin/main`:

   ```
   git worktree add -b <branch> ../me-<topic> origin/main
   ```

4. Write the task brief to `../me-<topic>/TASK.md`: goal, scope, plan,
   done-criteria (from $ARGUMENTS + interview answers). Keep it local-only:

   ```
   echo TASK.md >> .git/info/exclude
   ```

   (shared across worktrees; prevents /pr's `git add -A` from committing it)
5. All coding happens in `../me-<topic>` — never touch the main checkout.
   Follow AGENTS.md conventions; apps live under `apps/`. If the worktree
   lacks `node_modules`, run `pnpm install` there first.
6. Verify inside the worktree if app code changed:
   `pnpm --filter <app> lint && pnpm --filter <app> tsc`
   (skip for markdown-only changes).
7. Hand off: tell the user to open a session in `../me-<topic>` and run `/pr`
   there.

Rules:

- One task per worktree. If the task splits into two, stop and ask.
- Cleanup only when the user asks, after merge:
  `git worktree remove ../me-<topic> && git branch -d <branch>`
