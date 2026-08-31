# Karachi ICU Connect

A frontend-only hackathon demo that helps a family find reported ICU availability across Karachi hospitals, compare options, and contact the hospital directly to confirm. Built with React + Vite + Tailwind CSS.

> **Demo / prototype, not a production medical system.** Availability is the bundled demo dataset plus local-session edits. The app has **no backend, no cloud persistence, no real hospital APIs, and no production authentication**. Do not rely on it for medical decisions — always call the hospital to confirm.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite dev server (HMR) at `http://localhost:5173` |
| `npm run build` | Produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally at `http://localhost:4173` |
| `npm run lint` | Run Oxlint over the source tree |

## Architecture (current)

- **Frontend-only** — Vite + React 19 SPA. No backend, database, or third-party APIs.
- **Mock data** — Hospital availability comes from `src/data/hospitals.js` plus optional local overrides in `localStorage` (`karachi_icu_hospital_overrides`).
- **Mock auth** — `src/services/authService.js` ships demo accounts (public / staff / admin) and persists the session in `localStorage` (`karachi_icu_session`). It is explicitly labeled as not production-secure.
- **Demo Mode** — A guided tour (Step 10) with a scenario selector (Critical ICU, Find & Compare, Staff Update, Command Center) and in-memory state. `/impact` presents the problem, solution, and live demo facts.

## SPA routing & deployment

This is a single-page app. All routes are handled by React Router on the client. When deploying to a **static host**, the host must serve `index.html` for **all** paths so deep links (`/hospitals`, `/hospital/agh-khi-01`, `/admin`, `/recommend`, …) resolve to the application entry point instead of a 404.

Provider-neutral guidance:

- **Vercel / Netlify / Cloudflare Pages** — configure a SPA rewrite so any unknown path is served `index.html` (these platforms do this for most static frameworks; otherwise add a rewrite rule).
- **GitHub Pages** — set up an SPA-aware 404 redirect to `index.html`, or ship a `404.html` that mirrors `index.html`. This project does not include a `404.html`; configure your Pages site, or generate one at deploy time.
- **Nginx** — `try_files $uri /index.html;`
- **Node static host** — fall back to `index.html` on miss.

A React-level fallback for truly unknown URLs is in [`src/pages/NotFoundPage.jsx`](src/pages/NotFoundPage.jsx) (wired via `<Route path="*" />`).

The Vite `base` is left at the default (`/`). To deploy under a sub-path, set `base: '/your-subpath/'` in `vite.config.js` and rebuild.

## Environment variables

This project currently does **not** require any environment variable to run. A `.env*` file is gitignored so that any future variable (e.g. a deployment flag) can be added safely without committing secrets. The application must run with no `.env` present.

## Build output

`npm run build` produces `dist/`:

- `dist/index.html` — application entry point
- `dist/assets/*` — hashed JS and CSS bundles
- `dist/favicon.svg` — site favicon (from `public/`)

## Demo accounts

The login page exposes autofill chips for the demo accounts:

- `public@demo.com` — Public user
- `staff@demo.com` — Hospital Staff (Aga Khan University Hospital, `agh-khi-01`)
- `indus@demo.com` — Hospital Staff (Indus Hospital, `indus-khi-04`)
- `admin@demo.com` — Admin

The demo password is the one used for all demo accounts and is entered on the login screen (not embedded in this document).
