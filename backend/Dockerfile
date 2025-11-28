# ---------- Stage 1: Composer ----------
FROM composer:2 AS composer_stage
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# ---------- Stage 2: PHP + Nginx ----------
FROM richarvey/nginx-php-fpm:latest

# Copy application code
COPY --from=composer_stage /app /var/www/html

# Enable Laravel storage permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 80

# Laravel needs APP_KEY, so don't forget env in Render
CMD ["/start.sh"]
