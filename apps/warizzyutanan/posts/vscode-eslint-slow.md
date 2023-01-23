---
title: "vscode: slow Eslint"
date: "2023-01-23"
tags:
    - vscode
    - eslint
    - nodejs
publish: true
---

## TLDR;
It's because Javascript runs out of memory. Put this line into VS Code user settings. (The number depends on how much memory do you need.)
```json
"eslint.execArgv": ["--max_old_space_size=8192"]
```

## The problem
In the same project as my blog post about [Javascript heap out of memory](/posts/js-heap-out-of-memory), I usually experienced slowness of the Eslint plugin in VsCode. It often showed the notification in the picture below about 0.5-1 minute on every saving which was unaccepatable. 

![vscode eslint notification](/posts/vscode-eslint-slow/slow_noti.webp)

I inspected the output of the Eslint plugin, and found out that the error was `Javascript heap out of memory` again. So the workaround was going to be increasing NodeJs allocated memory for sure but I didn't know how to do it for a VS Code plugin.

![vscode eslint heap out of memory error](/posts/vscode-eslint-slow/error_msg.webp)

## The fix

Thanks for [an issue on Github for vscode-eslint](https://github.com/microsoft/vscode-eslint/issues/733), there is a way to input NodeJs option for the plugin by using `eslint.execArgv` in VS Code user settings. 

```json
"eslint.execArgv": ["--max_old_space_size=8192"]
```