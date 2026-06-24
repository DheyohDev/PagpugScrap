# Multi-stage Dockerfile
# Builder: build frontend assets with Node + PHP so artisan works during build
FROM php:8.4-cli-bullseye AS builder
WORKDIR /app
ENV PATH="/usr/local/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg build-essential python3 make g++ git unzip zip \
    libzip-dev libpng-dev libonig-dev libxml2-dev libjpeg-dev libwebp-dev libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && ln -sf /usr/local/bin/php /usr/bin/php \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock package.json package-lock.json* ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY . .
RUN if [ ! -f .env ] && [ -f .env.example ]; then cp .env.example .env; fi
RUN npm ci --no-audit --no-fund
RUN npm run build

# Runtime: PHP-FPM + Nginx
FROM php:8.4-fpm

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git unzip zip libzip-dev libpng-dev libonig-dev libxml2-dev \
       libjpeg-dev libwebp-dev libmagickwand-dev libpq-dev nginx curl ca-certificates \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql pdo_pgsql zip bcmath xml \
    && pecl install imagick || true \
    && pecl install redis || true \
    && docker-php-ext-enable imagick redis || true \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files and install PHP deps
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-plugins

# Copy built frontend assets from builder
COPY --from=builder /app/public/build /var/www/html/public/build

# Copy application source
COPY . /var/www/html

# Nginx config (will be overwritten by docker-compose mount in dev if needed)
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/build \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

CMD ["/usr/local/bin/entrypoint.sh"]
