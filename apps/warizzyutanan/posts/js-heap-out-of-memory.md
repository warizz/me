---
title: "Javascript heap out of memory"
date: "2023-01-17"
publish: true
tags:
    - javascript
    - nodejs
---

## The problem
I've found this error serveral time when I executed `eslint` on a large code-base. It means that the NodeJs runtime was using memory more than it was allocated.
```sh
<--- Last few GCs --->

[31454:0x7fc508008000]    58583 ms: Scavenge 4043.6 (4126.2) -> 4039.0 (4128.0) MB, 9.7 / 0.0 ms  (average mu = 0.581, current mu = 0.264) allocation failure
[31454:0x7fc508008000]    58609 ms: Scavenge 4045.6 (4128.0) -> 4041.0 (4130.0) MB, 9.6 / 0.0 ms  (average mu = 0.581, current mu = 0.264) allocation failure
[31454:0x7fc508008000]    59203 ms: Scavenge 4047.4 (4130.0) -> 4042.7 (4147.2) MB, 575.5 / 0.0 ms  (average mu = 0.581, current mu = 0.264) allocation failure


<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
...
```

## The fix
Fixing is quite easy, just allocate more memory to NodeJs, but the tricky part is how big the memory should it be? The answer is in the error message, `Scavenge 4043.6 (4126.2) -> 4039.0 (4128.0) MB`, you can see that it used up all the 4GB we have, so if we increase it to be more than that should be fine.
```sh
export NODE_OPTIONS="--max-old-space-size=8096"
```