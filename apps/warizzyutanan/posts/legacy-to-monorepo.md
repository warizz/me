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

this api-gateway is a NodeJs Express app, it also have commands like dev, test, lint and tsc. Now I can test running these 2 apps simulanoesly by just running those commands.

```bash
> npx nx run-many --targets lint


    ✔  nx run gateway:lint  [existing outputs match the cache, left as is]
    ✔  nx run web-client:lint (45s)

 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target lint for 2 projects (45s)

   Nx read the output from the cache instead of running the command for 1 out of 2 tasks.
```

I have to move another repo, this one would be user-service for getting user information. the flow chart for the system would be like this.

```
web-client --> gateway --> user-service --> DB
```

This command copies all contents of the service into `apps/user-service`

```bash
rsync -av --exclude='.git' --exclude='node_modules' user-service inv-web-monorepo/apps
```

Now my repo is like this.

```
.vscode
apps
    api-gateway
    user-service
    web-client
.gitignore
.npmrc
nx.json
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
```

Again, run `pnpm i` for installing dependencices of the user-service. Run `pnpm lint` for roughly checking if the code is fine.

```bash
> npx nx run-many --targets lint


    ✔  nx run gateway:lint (4s)
    ✔  nx run account-service:lint (7s)
    ✔  nx run investment-platform-web:lint (36s)

 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target lint for 3 projects (36s)
```

## Orchastrate all apps together

I have to update each apps server port because they were using the same value. nx has a document on how to define environment variables [here](Define Environment Variables
). in this case i want to keep the port variables in the root so i can be the only single source for connecting each app together.

i created `.env.local` in the root that look like this.

```
WEB_CLIENT_PORT=3000
GATEWAY_PORT=3001
USER_SERVICE_PORT=3002
```
