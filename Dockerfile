# =====================================================
# Stage 1 : Builder
# Composer + Node + Laravel Build
# =====================================================

FROM php:8.4-cli-bullseye AS builder

WORKDIR /app

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    git \
    unzip \
    zip \
    build-essential \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libpq-dev \
    libxml2-dev \
    libonig-dev \
    \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    \
    && node --version \
    && npm --version \
    \
    && docker-php-ext-configure gd \
        --with-jpeg \
        --with-webp \
    \
    && docker-php-ext-install -j$(nproc) \
        gd \
        zip \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        bcmath \
        xml \
    \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


# Copy source
COPY . .

# Ensure bootstrap cache directory exists and remove stale package discovery cache before install
RUN mkdir -p bootstrap/cache \
    && rm -f bootstrap/cache/packages.php bootstrap/cache/services.php || true

# Environment Laravel
RUN if [ ! -f .env ]; then \
        cp .env.example .env; \
    fi


# Install Laravel dependency
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction


# Install frontend dependency
RUN npm ci \
    --no-audit \
    --no-fund


# Build Vite
RUN npm run build



# =====================================================
# Stage 2 : Runtime
# PHP-FPM + Nginx
# =====================================================

FROM php:8.4-fpm-bullseye AS production


WORKDIR /var/www/html


ENV COMPOSER_ALLOW_SUPERUSER=1


RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libpq-dev \
    libxml2-dev \
    libonig-dev \
    libmagickwand-dev \
    && docker-php-ext-configure gd \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install \
        gd \
        zip \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        bcmath \
        xml \
    && pecl install redis imagick \
    && docker-php-ext-enable redis imagick \
    && rm -rf /var/lib/apt/lists/*



# Copy Laravel application

COPY . .

# Ensure stale package discovery cache is removed before runtime
RUN rm -f bootstrap/cache/packages.php bootstrap/cache/services.php || true

# Copy vendor dari builder

COPY --from=builder /app/vendor ./vendor


# Copy hasil Vite build

COPY --from=builder /app/public/build ./public/build



# Permission Laravel

RUN mkdir -p \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        bootstrap/cache \
    && chown -R www-data:www-data \
        storage \
        bootstrap/cache \
    && chmod -R 775 \
        storage \
        bootstrap/cache



# Nginx config

COPY docker/nginx/default.conf \
     /etc/nginx/sites-enabled/default



# Supervisor

COPY docker/supervisor/supervisord.conf \
     /etc/supervisor/conf.d/supervisord.conf



# Entrypoint

COPY docker/php/entrypoint.sh \
     /usr/local/bin/entrypoint.sh


RUN chmod +x /usr/local/bin/entrypoint.sh


EXPOSE 80


CMD ["/usr/local/bin/entrypoint.sh"]