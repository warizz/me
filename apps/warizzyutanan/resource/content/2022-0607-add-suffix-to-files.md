---
title: "Add suffix to multiple files."
date: "2022-06-07"
tags:
  - command-line
  - post
publish: true
---

```sh
for i in folder_name/**/*.ts; do mv "$i" "${i%.*}.whatever.ts"; done
```
