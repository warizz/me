---
title: 'turborepo: Failed to find package "turbo-linux-64" on the file system.'
date: "2023-01-03"
tags:
    - turborepo
    - github-actions
    - npm
publish: true
---

## The error
```sh
npm ERR! [turbo] Failed to find package "turbo-linux-64" on the file system
```

## The fix
In the root of the repo, run this command.
```sh
npm i turbo-linux-64 --save-optional
```

## The root cause
The package `turbo-linux-64` is an optional dependency of `turbo@v1.6.3`, if we run `npm i package-name` on our local machine that is not Linux, in some cases, `npm` will remove `turbo-linux-64` from the lock file. 
Having `turbo-linux-64` as an optional dependency in the root of our repo ensures that the package will be available if it is installable on any machine.