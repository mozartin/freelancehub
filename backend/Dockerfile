FROM php:8.3-cli

# System packages and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
    libpq-dev \
    ca-certificates \
  && docker-php-ext-install pdo pdo_pgsql pdo_sqlite bcmath

# Working directory inside container
WORKDIR /var/www/html

# Copy entire Laravel project into container
COPY . .

# Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && rm composer-setup.php

# Create .env file if it doesn't exist (needed for artisan commands)
RUN if [ ! -f .env ]; then cp .env.example .env 2>/dev/null || echo "APP_NAME=Laravel" > .env; fi

# Install Laravel dependencies (including dev for seeders)
ENV COMPOSER_ALLOW_SUPERUSER=1
# Skip scripts during install to avoid package:discover error (APP_KEY not set yet)
RUN composer install --optimize-autoloader --no-interaction --no-progress --no-scripts
# Generate app key and run package discovery after install
RUN php artisan key:generate --force || true
RUN php artisan package:discover --ansi || true

# Copy and make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (for local)
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

