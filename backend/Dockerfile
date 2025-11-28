# ---------- Stage 1: Composer ----------
FROM composer:2 AS composer_stage
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# ---------- Stage 2: PHP + Nginx ----------
FROM richarvey/nginx-php-fpm:latest

# Laravel живёт в public/, говорим это nginx'у
ENV WEBROOT=/var/www/html/public

# Копируем приложение из composer-стейджа
COPY --from=composer_stage /app /var/www/html

# Рабочая директория
WORKDIR /var/www/html

# Создаём файл SQLite базы
RUN touch /var/www/html/database/database.sqlite

# Миграции + сиды (если что-то в них упадёт - контейнер все равно поднимется)
RUN php artisan migrate --force && php artisan db:seed --force || true

# Права на storage и cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Порт
EXPOSE 80

# Стартовый скрипт nginx-php-fpm образа
CMD ["/start.sh"]
