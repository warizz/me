---
title: "Git: see diff between 2 branches"
date: "2022-05-21"
tags:
    - git
    - command-line
publish: true
---

```sh
// On the main branch
git diff main..your/branch > diff.patch
// Apply the changes on any branch
git apply diff.patch
```