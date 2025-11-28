# ---------- Stage 1: Composer ----------
FROM composer:2 AS composer_stage
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# ---------- Stage 2: PHP + Nginx ----------
FROM richarvey/nginx-php-fpm:latest

# Laravel живёт в public/, скажем nginx об этом
ENV WEBROOT=/var/www/html/public

# Копируем приложение из первого этапа
COPY --from=composer_stage /app /var/www/html

# Рабочая директория
WORKDIR /var/www/html

# Создаём файл базы
RUN touch /var/www/html/database/database.sqlite

# Миграции + сиды (если упадут — контейнер всё равно поднимется)
RUN php artisan migrate --force && php artisan db:seed --force || true

# Права
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Порт
EXPOSE 80

CMD ["/start.sh"]
