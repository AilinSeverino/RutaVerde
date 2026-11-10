# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (public site)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview
```

No test runner is configured. The `backoffice/` app has its own `package.json` (own `node_modules`); run `npm install` and `npm run dev` (port 5174) / `npm run build` from inside it. It has no lint script.

## Architecture

Ruta Verde is a Spanish-language React 19 + TypeScript + Vite SPA (react-router-dom v7, Leaflet/react-leaflet for the map). UI text, identifiers and comments are in Spanish.

- **Two separate apps**: the root app is the public site; `backoffice/` is an independent admin app (its own `src/`, context, pages, types) used e.g. to publish news. They share nothing by import.
- **Backend**: not in this repo. Both Vite configs proxy `/api/*` to `http://localhost:5000`, so the API server must be running for data (ecorregiones, noticias, regiones, baldosas, login/registro, perfil, etc.). [api.js](api.js) exports a shared axios instance with `baseURL: '/'`; components call it with full `/api/...` paths. Auth calls pass `withCredentials: true` (cookie session).
- **Auth**: [src/context/AuthContext.tsx](src/context/AuthContext.tsx) provides `usuario`, `isLoggedIn`, `authLoading`, `login`, `logout`, `updateUsuario`. On mount it verifies the session via `GET /api/sesion` and mirrors the user in localStorage (`ruta-verde-usuario`). The `Usuario` interface mirrors the DB `Usuarios` table (`id_usuario`, `nombreC`, `fotoPerfil`, `id_region`, ...). Provider wraps the router in [src/App.tsx](src/App.tsx). The README documents this context (in Spanish).
- **Routing**: all routes are declared in [src/App.tsx](src/App.tsx) (`/`, `/mapa`, `/historia`, `/aportes`, `/newsletter`, `/ingresar`, `/registrarse`, `/recuperar`, `/perfil`). `src/pages/*` are thin page wrappers composing `src/components/*`; each component usually has a sibling `.css` file (plain CSS, no CSS framework).
- **Data**: `src/data/ecorregiones.ts` and `noticias.ts` hold static/fallback data and types; the app is being moved from hardcoded data to API-backed data. Shared types live in [src/interfaz.ts](src/interfaz.ts).
