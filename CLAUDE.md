# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevBlog is a React SPA for a developer blog platform. The UI is in Brazilian Portuguese (pt-BR). It uses two external npm packages as core dependencies:
- **nauth-react** — authentication (login, register, password reset, profile). Provides `NAuthProvider` and `useAuth` hook.
- **nnews-react** — news/articles CRUD (articles, categories, tags). Provides `NNewsProvider`.

Both libraries connect to remote APIs configured via environment variables and use a tenant header (`X-Tenant-Id: devblog`).

## Commands

- `npm run dev` — start Vite dev server on port 5173
- `npm run build` — TypeScript check + Vite production build
- `npm run type-check` — TypeScript type checking only (`tsc --noEmit`)
- `npm run preview` — preview production build locally

There are no tests or linting configured.

## Architecture

**Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 3, React Router 7

**Entry flow:** `index.html` → `src/main.tsx` → `src/App.tsx`

**App.tsx** wraps the entire app in `BrowserRouter` → `NAuthProvider` → `NNewsProvider`, then defines all routes inside a `Layout` component. Routes are split into public and protected (guarded by `ProtectedRoute` which checks `useAuth().isAuthenticated`).

**Key directories:**
- `src/pages/` — page-level components, one per route
- `src/components/` — shared components (Layout, Navbar, ProtectedRoute)
- `src/lib/constants.ts` — route paths and app name constants

**Environment variables** (prefixed with `VITE_`):
- `VITE_AUTH_API_URL` — NAuth API base URL
- `VITE_NEWS_API_URL` — NNews API base URL

**Tailwind config** includes content paths for `nauth-react` and `nnews-react` dist folders so their component styles are picked up. Dark mode uses class strategy. Toast notifications use `sonner` with `<Toaster>` in Layout.

**TypeScript** is strict mode with `noUnusedLocals` and `noUnusedParameters` enabled.
