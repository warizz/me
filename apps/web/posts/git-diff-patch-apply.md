---
title: "See diff between 2 branches"
tags:
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