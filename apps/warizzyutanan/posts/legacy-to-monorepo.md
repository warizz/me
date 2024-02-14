---
title: "Convert a legacy create-react-app app to pnpm monorepo"
date: "2024-01-06"
publish: true
tags:
  - create-react-app
  - monorepo
  - node-js
  - nx
  - pnpm
  - react
---

Initially, the project's root structure appeared like this:

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

Next, I began by relocating all the application-specific files into a folder named `apps/web-client` following this route:

1. Removed `node_modules` to prevent copying a folder of vast size.
2. Maintained `.git` in the root directory.

```bash
.
├── .git/
├── .vscode/
└── apps/web-client
```

To establish the pnpm workspace configuration, I created a `pnpm-workspace.yaml` file in the root directory with the following content:

```yml
packages:
  - "apps/*"
```

Then, I initiated pnpm in the root directory by executing the following commands:

```bash
pnpm init
pnpm install
```

Upon completion, A `pnpm-lock.yaml` file was generated in the root directory.

Once the pnpm monorepo setup was established, I introduced NX to manage the project more efficiently. Here's how I integrated NX into the workflow:

First, I initiated NX by running:

```bash
npx create-nx-workspace@latest
```

During initialization, I skipped specifying scripts execution order but configured cacheable scripts such as `build`, `test`, `lint`, and `tsc`. I designated the build folder for the output of the build script and left others blank.

Upon successful initialization, nx.json was created in the root directory.

## Setting up commands

To streamline command execution across the monorepo, I updated the scripts field in the root's `package.json`:

```json
"scripts": {
    "dev": "npx nx run-many --targets dev",
    "test": "npx nx run-many --targets test",
    "lint": "npx nx run-many --targets lint",
    "tsc": "npx nx run-many --targets tsc"
},
```

I verified the functionality of these commands by running them from the root directory:

```bash
pnpm run dev
pnpm run test
pnpm run lint
pnpm run tsc
```

Thanks to NX's caching mechanism, subsequent executions were notably faster.

## Adding Another App

Integrating an additional app, such as an `api-gateway`, was straightforward. I simply copied the target repository into `{root}/apps/`, maintaining a similar structure to the existing web-client.

Next, I added another repository, `user-service`, following a similar procedure. This service was responsible for retrieving user information.

```bash
.
├── .vscode
├── apps
│   ├── web-client
│   ├── api-gateway
│   └── user-service
├── .gitignore
├── .npmrc
├── nx.json
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Orchestrating All Apps Together

To ensure seamless orchestration, I updated each app's server port to avoid conflicts. I centralized the port variables in the root directory by creating a `.env.local` file:

```bash
WEB_CLIENT_PORT=3000
API_GATEWAY_PORT=3001
USER_SERVICE_PORT=3002
```

With these configurations in place, the monorepo was now ready for efficient development and testing, with NX managing the intricate dependencies between the various apps.
