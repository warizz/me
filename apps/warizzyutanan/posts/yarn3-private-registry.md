---
title: "yarn: migrate private registry from version 1 config to version 3"
date: "2023-01-04"
publish: true
tags:
    - yarn
---
Let's say that you have a package from your private registry `@your-company/awesome-lib`

## Before
`.npmrc`

```
//your.company.com/private/registry/:_authToken=token
```
`.yarnrc`

```
"@your-company:registry" "//your.company.com/private/registry/"
```

## After
`.yarnrc.yml`

```yml
nodeLinker: node-modules # This line should be created automatically.
npmRegistries:
  //your.company.com/private/registry/:
    npmAuthToken: "token"
npmScopes:
  your-company:
    npmPublishRegistry: "https://your.company.com/private/registry"
    npmRegistryServer: "https://your.company.com/private/registry"
```