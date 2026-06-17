# Shree Ram Consultancy — Local MVP

Quick steps to run the local frontend and backend for development.

Backend (API)

1. Open a terminal and go to `backend` folder

```bash
cd backend
npm install
cp .env.example .env
# edit .env to set DB credentials, ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET
npm run dev
```

Frontend (Vite + React)

1. Open another terminal and go to `frontend` folder

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:3000`. The backend CORS accepts local Vite ports `5173`, `5174`, and `5175` by default.

Notes
- Admin auth currently uses a simple username/password login and JWT-based API access. Google login can be added later when OAuth setup is ready.
- In production, set a strong `ADMIN_PASSWORD` and a `JWT_SECRET` with at least 32 characters. The backend refuses weak production secrets.
- Create the `leads` table in MySQL before testing. Use the migration file:

```sql
source backend/migrations/001_create_leads.sql;
```

Common dev console messages
- You may see this Tailwind message in the browser console: "cdn.tailwindcss.com should not be used in production..." — this is an informational warning emitted by the CDN build and is expected during development. To remove it for production, install Tailwind as a PostCSS plugin and rebuild assets (I can set this up next).
- The frontend previously caused a 404 for `/favicon.ico`; an inline SVG favicon has been added to `index.html` so the dev server no longer returns 404 for the icon.

Tailwind (PostCSS) setup
- I've replaced the CDN usage with a proper PostCSS + Tailwind setup. After pulling these changes, run `npm install` inside `frontend` to install `tailwindcss`, `postcss`, and `autoprefixer`. Vite will process the `src/index.css` containing Tailwind directives during `npm run dev`.

Admin login setup
- The admin area is protected by username/password login and JWT-based API access.
- Create `frontend/.env` from `frontend/.env.example` and set `VITE_API_BASE_URL` if the backend is not running on `http://localhost:3000`.
- Update `backend/.env` from `backend/.env.example` and set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET`.
- Visit `/admin` in the browser to access the admin sign-in page after the frontend is running.

What has been optimized
- Public UI now uses a responsive service discovery flow with direct call, WhatsApp, and callback actions.
- Frontend reads business/service config from `/api/config` with a local fallback.
- Lead submission validates service names, phone format, name length, message length, and request body size.
- Admin API supports paginated lead listing, status filtering, and status updates.
- Backend config is centralized in `backend/config.js`, with production checks for weak secrets.
- Server now has route-level rate limits, safer JSON limits, CORS origin allow-listing, 404 handling, graceful shutdown, and DB-aware health checks.
