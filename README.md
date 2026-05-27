# pagpug-app

pagpug-app is an internal application built with Laravel (backend) and React/Inertia (frontend). It serves as a dashboard and an API proxy for a separate "Google Maps Scraping Service" running on a Debian server.

Summary:
- Backend: Laravel 12 (PHP 8.2+)
- Frontend: React 19 + Inertia.js, Vite, TailwindCSS
- Purpose: Provide a UI to view and create scraping jobs and to act as an API proxy that communicates with the external scraping service (avoids CORS and security issues).

Key features:
- Dashboard and `Scraping Jobs` page (Inertia + React).
- API proxy endpoints under `/api/v1/...` that forward requests to the external scraping service configured via `SCRAPING_SERVICE_API_URL`.
- Asynchronous CSV import into the database using queued jobs (`app/Jobs/ProcessCsvImport.php`).
- Layered architecture: Controller → Service → Repository → Model → Database.

Requirements & stack:
- PHP ^8.2, Laravel 12
- Node 18+ (Vite, React, Tailwind)
- Composer, npm/pnpm

Quick start (development):
1. Copy the environment file and install dependencies:

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
```

2. Configure the scraping service URL in `.env`:

```env
SCRAPING_SERVICE_API_URL="http://server.local"
```

3. Run migrations (configure DB in `.env`) and start development servers:

```bash
php artisan migrate
npm run dev
php artisan serve
```

Testing & linting:
- Run backend tests: `php artisan test` (Pest/PHPUnit)
- Run frontend lint/format: `npm run lint` / `npm run format`

Important paths (summary):
- `app/Http/Controllers/Api/` — API proxy controllers
- `app/Services/` — business logic
- `app/Repositories/` — data access abstractions
- `app/Jobs/` — queued workers (CSV import)
- `app/Models/` — Eloquent models
- `resources/js/` — frontend (pages, components, layouts)
- `routes/web.php`, `routes/api.php` — routing

Notes:
- The frontend never calls the scraping service directly; all requests are proxied through Laravel for security and CORS reasons.
- The external scraping service returns JSON fields with case-sensitive capitalization; TypeScript interfaces must match the exact field names.
- Creating jobs via the `CreateJobModal` may currently fail due to POST payload issues — see `Documentation/Technical-Documentation.md` for debugging details.

Integration with external scraper repository:
- This application is integrated with the Google Maps Scraper repository located at: https://github.com/DheyohDev/google-maps-scraper.git
- The Laravel backend acts as a proxy to the scraper service running from that repository (configured via `SCRAPING_SERVICE_API_URL`). Ensure the scraper service is running and reachable by the URL set in `.env`.

If you want, I can also:
- Add an example `.env.example` snippet for all required environment variables.
- Add a short troubleshooting section for common integration problems with the external scraper service.
