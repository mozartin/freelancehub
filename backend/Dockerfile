# Базовый образ с PHP 8.3 и CLI
FROM php:8.3-cli

# Устанавливаем системные пакеты и расширения PHP
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
  && docker-php-ext-install pdo pdo_sqlite bcmath

# Рабочая директория внутри контейнера
WORKDIR /var/www/html

# Устанавливаем composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && rm composer-setup.php

# Сначала копируем только composer-файлы — это ускоряет сборку
COPY composer.json composer.lock ./

# Ставим зависимости
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Теперь копируем всё приложение
COPY . .

# Создаём файлы/папки, настраиваем права и кеши
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
  && touch database/database.sqlite \
  && chown -R www-data:www-data storage bootstrap/cache database \
#   && php artisan key:generate --force \
  && php artisan config:cache \
  && php artisan route:cache

# Порт внутри контейнера (для локала/дебага; Render всё равно пробрасывает свой)
EXPOSE 8000

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
