# ---------- Stage 1: Composer ----------
FROM composer:2 AS composer_stage
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# ---------- Stage 2: PHP + Nginx ----------
FROM richarvey/nginx-php-fpm:latest

# Докрутка для Laravel:
ENV WEBROOT=/var/www/html/public

# Copy application code
COPY --from=composer_stage /app /var/www/html

WORKDIR /var/www/html

# Create SQLite database file
RUN touch /var/www/html/database/database.sqlite

RUN php artisan migrate --force && php artisan db:seed --force || true

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["/start.sh"]
