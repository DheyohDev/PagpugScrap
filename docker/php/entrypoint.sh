#!/bin/sh
set -e

# copy example env if .env missing
if [ ! -f /var/www/html/.env ]; then
  if [ -f /var/www/html/.env.example ]; then
    cp /var/www/html/.env.example /var/www/html/.env
  fi
fi

cd /var/www/html

# ensure app key
php artisan key:generate --force || true

# ensure storage link
php artisan storage:link || true

# run migrations (may block until external DB available)
php artisan migrate --force || true

# start php-fpm and nginx
php-fpm &
nginx -g 'daemon off;'
