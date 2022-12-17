---
title: "Add suffix to multiple files."
tags:
    - command-line
publish: true
---
# Add suffix to multiple files.

```sh
for i in folder_name/**/*.ts; do mv "$i" "${i%.*}.whatever.ts"; done
```