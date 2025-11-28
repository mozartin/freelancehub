# ---------- Stage 1: Composer ----------
FROM composer:2 AS composer_stage
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# ---------- Stage 2: PHP + Nginx ----------
FROM richarvey/nginx-php-fpm:latest

# Copy application code
COPY --from=composer_stage /app /var/www/html

# Set working directory
WORKDIR /var/www/html

# Create SQLite database file
RUN touch /var/www/html/database/database.sqlite

# Run migrations and seeders automatically
RUN php artisan migrate --force && php artisan db:seed --force || true

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 80

CMD ["/start.sh"]
