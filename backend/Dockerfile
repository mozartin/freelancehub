FROM php:8.3-cli

# Системные пакеты и расширения PHP
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
  && docker-php-ext-install pdo pdo_sqlite bcmath

# Рабочая директория внутри контейнера
WORKDIR /var/www/html

# Копируем весь Laravel-проект внутрь контейнера
COPY . .

# Устанавливаем composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && rm composer-setup.php

# Ставим зависимости Laravel
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Открываем порт (для локала)
EXPOSE 8000

# Запускаем Laravel-сервер
# CMD ["sh", "-c", "php artisan migrate --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
CMD ["sh", "-c", "php artisan migrate --force || true && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
