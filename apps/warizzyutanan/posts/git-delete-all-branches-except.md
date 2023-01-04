---
title: "Git: delete all branches except a,b,c"
date: "2023-01-04"
tags:
    - git
publish: true
---

```sh
git branch | grep -v "a" | grep -v "b" | grep -v "c" | xargs git branch -D
```

- `git branch` -- list all available branches.
- `grep -v "a" | grep -v "b" | grep -v "c"` -- matches all branches except a,b or c.
- `xargs git branch -D` -- excute `git branch -D` with the result from `grep`.