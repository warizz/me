# Next.js App Router Insights

Spent time understanding the Next.js App Router architecture.

## Server Components vs Client Components

- **Server Components**: Default, run on server, no JavaScript sent to client
- **Client Components**: Use `"use client"` directive, run in browser

## Key Pattern

Always start with Server Components and only add `"use client"` when you need:

- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)
- React hooks (`useState`, `useEffect`)

This approach minimizes the JavaScript bundle size and improves performance.
