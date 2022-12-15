---
title: "Git: see diff between 2 branches"
tags:
    - programming
    - git
publish: true
---
# Git: see diff between 2 branches

```sh
// On the main branch
git diff main..your/branch > diff.patch
// Apply the changes on any branch
git apply diff.patch
```