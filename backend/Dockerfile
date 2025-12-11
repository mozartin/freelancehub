FROM php:8.3-cli

# System packages and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
  && docker-php-ext-install pdo pdo_sqlite bcmath

# Working directory inside container
WORKDIR /var/www/html

# Copy entire Laravel project into container
COPY . .

# Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && rm composer-setup.php

# Install Laravel dependencies (including dev for seeders)
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --optimize-autoloader --no-interaction --no-progress

# Expose port (for local)
EXPOSE 8000

# Start Laravel server
CMD ["sh", "-c", "php artisan migrate --force --seed || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]

