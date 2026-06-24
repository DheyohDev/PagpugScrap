# Docker: Laravel + Redis setup

Quick commands (build + run):

```bash
docker compose build
docker compose up -d
```

Notes:
- This compose includes `app` (PHP-FPM + Nginx) and `redis` services. The database is external — set DB_* values in your `.env` before `up`.
- `storage` is mounted to a Docker volume. Uploaded files persist across restarts.
- On container start the entrypoint will attempt `php artisan migrate --force` (it will retry fail silently). If migrations fail due to DB unavailability, run them manually:

```bash
docker compose exec app php artisan migrate --force
```

To run the app in development with Vite hot reload, run `npm run dev` locally (bind mounts are not configured for dev mode by default).
