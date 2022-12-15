---
title: "Add suffix to multiple files."
tags:
    - programming
    - shell
---
# Add suffix to multiple files.

```sh
for i in folder_name/**/*.ts; do mv "$i" "${i%.*}.whatever.ts"; done
```