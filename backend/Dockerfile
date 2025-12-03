FROM php:8.3-cli

# Системные пакеты и расширения
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
  && docker-php-ext-install pdo pdo_sqlite bcmath

# Рабочая директория
WORKDIR /var/www/html

# Сначала копируем ВЕСЬ проект (чтобы artisan уже был на месте)
COPY . .

# Устанавливаем composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && rm composer-setup.php

# Ставим зависимости Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Подготовка storage и базы
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
  && touch database/database.sqlite \
  && chown -R www-data:www-data storage bootstrap/cache database \
  && php artisan config:cache \
  && php artisan route:cache

# Порт (для локали, на Render подставится $PORT)
EXPOSE 8000

# Запуск Laravel-сервера
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
