---
title: "Convert a legacy create-react-app app to pnpm monorepo"
date: "2024-01-06"
publish: true
tags:
  - create-react-app
  - monorepo
  - pnpm
  - react
---

I have a CRA project that have the root looks like this

```bash
.
# folders
├── .git/ # keep in the root
├── .vscode/ # keep in the root
├── node_modules/ # delete
├── playwright/
├── public/
├── scripts/
├── src/
# files
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierrc
├── .stylelintrc
├── README.md
├── alias.path.js
├── babel.config.js
├── config-overrides.js
├── dependency-suppressions.xml
├── nyc.config.js
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.path.json
└── vite.config.ts
```

Then move all the app specific files into a folder name apps/web-client, my route is like this.

> remove `node_modules` to avoid vast size folder copying
> keep `.git` in the root

```bash
.git/
.vscode/
apps/web-client
```

create a [`pnpm-workspace.yaml`](https://pnpm.io/pnpm-workspace_yaml) in the root

```yml
packages:
  - "apps/*"
```

Init pnpm on the root

```bash
pnpm init
pnpm install
```

you will see `pnpm-lock.yaml` created on the root

create `.gitignore` in the root.

```
node_modules
```

now it's the time for [nx](https://nx.dev/getting-started/installation#installing-nx-into-an-existing-repository) come into play.

```bash
npx create-nx-workspace@latest
```

question

> ? Which scripts need to be run in order? (e.g. before building a project, dependent projects must be built) …

hit enter for skipping it for now .

> ? Which scripts are cacheable? (Produce the same output given the same input, e.g. build, test and lint usually are, serve and start are not) …

this one is for caching, i selected build, test, lint, tsc

put build folder for output for build script, leave blank for the others.

after the successful init, `nx.json` will be created in the root.

## Setting up commands

Update scripts field in root's package.json, it will make running these commands trigger the same script name across monorepo.

```json
"scripts": {
    "dev": "npx nx run-many --targets dev",
    "test": "npx nx run-many --targets test",
    "lint": "npx nx run-many --targets lint",
    "tsc": "npx nx run-many --targets tsc"
},
```

Check if the commands work by running them from the root for example.

```bash
pnpm run dev
pnpm run test
pnpm run lint
pnpm run tsc
```

If you run these commands the 2nd time they will be super fast because of the caching that nx orchastreted.

## Adding another repo

It is time for API gateway, this is easier by just copying the target repo into the root/apps/. it would be something like this.

```
.vscode
apps
  web-client
  api-gateway
.gitignore
.npmrc
nx.json
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
```
