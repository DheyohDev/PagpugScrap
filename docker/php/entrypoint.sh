#!/bin/bash

set -e


echo "Starting Laravel container..."


cd /var/www/html


# Generate app key jika belum ada

if [ -z "$APP_KEY" ]; then

    php artisan key:generate --force

fi



# Permission

chown -R www-data:www-data \
    storage \
    bootstrap/cache



chmod -R 775 \
    storage \
    bootstrap/cache



# Laravel optimize

php artisan storage:link || true


php artisan config:cache || true

php artisan route:cache || true

php artisan view:cache || true



echo "Laravel ready"



exec supervisord -c /etc/supervisor/conf.d/supervisord.conf