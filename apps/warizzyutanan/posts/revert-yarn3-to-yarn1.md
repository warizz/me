---
title: "yarn: revert from v3 to v1"
date: "2023-01-04"
publish: true
tags:
    - yarn
---

I have a repo using legacy yarn, migrating it to the modern one needs going back and forth between v1 and v3.

## Prerequisites
- yarn 1 installed.
- modern yarn installed using `corepack`. (see [modern yarn installation](https://yarnpkg.com/getting-started/install))

## Disabling the modern yarn
```sh
corepack disable yarn
```

If you want to bring it back, simply run.
```sh
corepack enable yarn
```