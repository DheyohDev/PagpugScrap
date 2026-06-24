# No Destructive Database Commands

## Never Run Destructive Commands on Production or Shared Databases

The following `php artisan` commands and SQL statements are strictly forbidden unless explicitly approved by the user:

### Forbidden Artisan Commands

- `php artisan migrate:fresh` — drops all tables and re-runs migrations
- `php artisan migrate:reset` — rolls back all migrations
- `php artisan migrate:refresh` — rolls back and re-runs all migrations
- `php artisan db:wipe` — drops all tables
- `php artisan db:drop` — drops the database

### Forbidden SQL Operations

- `DROP TABLE`, `DROP DATABASE`, `DROP SCHEMA`
- `TRUNCATE TABLE` — removes all rows without logging
- Mass `DELETE` without a precise `WHERE` clause
- `REVOKE` or `GRANT` that removes access rights without explicit user request

## Database User Permissions

The `copilot_dev` database user/role must never have destructive permissions:

```sql
-- Restrict copilot_dev to read-only or limited write access
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM copilot_dev;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM copilot_dev;
REVOKE DROP ON ALL TABLES IN SCHEMA public FROM copilot_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE DELETE ON TABLES FROM copilot_dev;
```

## Safe Alternatives

Instead of destructive commands, prefer:

| Instead of | Use |
|---|---|
| `migrate:fresh` | Create a new migration for the change |
| `db:wipe` | Explicit `Schema::dropIfExists()` in a reversible migration |
| `TRUNCATE` | `Model::query()->delete()` in a queued job with confirmation |
| `DELETE FROM table` | `Model::where(...)->delete()` with precise conditions |

## When Destructive Commands Are Acceptable

Only in these specific scenarios:

1. **Local development environment** — after confirming with the user
2. **Explicit user request** — when the user says "yes, run it"
3. **In a migration `down()` method** — as a reversible schema change
