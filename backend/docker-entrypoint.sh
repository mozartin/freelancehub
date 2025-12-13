#!/bin/sh

echo "=== Starting Laravel Backend ==="

# Create .env if missing
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        cat > .env <<EOF
APP_NAME=FreelanceHub
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
EOF
    fi
fi

# Detect desired DB connection (env var has priority)
DB_CONNECTION_ENV="${DB_CONNECTION:-}"
if [ -z "$DB_CONNECTION_ENV" ]; then
    DB_CONNECTION_ENV="$(grep '^DB_CONNECTION=' .env | cut -d'=' -f2-)"
fi
[ -z "$DB_CONNECTION_ENV" ] && DB_CONNECTION_ENV="sqlite"

if [ "$DB_CONNECTION_ENV" = "sqlite" ]; then
    # Ensure sqlite settings and file exist
    sed -i 's|^DB_CONNECTION=.*|DB_CONNECTION=sqlite|' .env 2>/dev/null || true
    sed -i 's|^DB_DATABASE=.*|DB_DATABASE=database/database.sqlite|' .env 2>/dev/null || true
    grep -q "^DB_CONNECTION=" .env || echo "DB_CONNECTION=sqlite" >> .env
    grep -q "^DB_DATABASE=database/database.sqlite" .env || echo "DB_DATABASE=database/database.sqlite" >> .env
    mkdir -p database
    touch database/database.sqlite
    chmod 664 database/database.sqlite
else
    # Sync .env with provided DB_* env vars (pgsql, etc.)
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=${DB_CONNECTION_ENV}|" .env 2>/dev/null || true
    if [ -n "$DB_HOST" ]; then sed -i "s|^DB_HOST=.*|DB_HOST=${DB_HOST}|" .env 2>/dev/null || true; fi
    if [ -n "$DB_PORT" ]; then sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT}|" .env 2>/dev/null || true; fi
    if [ -n "$DB_DATABASE" ]; then sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE}|" .env 2>/dev/null || true; fi
    if [ -n "$DB_USERNAME" ]; then sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME}|" .env 2>/dev/null || true; fi
    if [ -n "$DB_PASSWORD" ]; then sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|" .env 2>/dev/null || true; fi
    # Default SSL mode for external hosts
    DB_SSLMODE_VALUE="${DB_SSLMODE:-require}"
    sed -i "s|^DB_SSLMODE=.*|DB_SSLMODE=${DB_SSLMODE_VALUE}|" .env 2>/dev/null || true
fi

# Generate APP_KEY if missing or empty
if ! grep -q "^APP_KEY=base64:" .env; then
    echo "Generating APP_KEY..."
    APP_KEY=$(php -r "echo 'base64:'.base64_encode(random_bytes(32));")
    sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" .env 2>/dev/null || echo "APP_KEY=$APP_KEY" >> .env
fi

# Run migrations (non-blocking)
echo "Running migrations..."
php artisan migrate --force || echo "Migrations failed, continuing..."

# Run seeders (non-blocking)
echo "Running seeders..."
php artisan db:seed --force || echo "Seeders failed, continuing..."

# Start server using PHP built-in server (more reliable than artisan serve)
echo ""
APP_PORT="${PORT:-8000}"
echo "==================================="
echo "Starting Laravel server on :${APP_PORT}"
echo "==================================="
echo "APP_KEY: $(grep '^APP_KEY=' .env | head -c 50)..."
echo "DB: $(grep '^DB_DATABASE=' .env)"
echo ""
echo "Starting PHP built-in server..."
cd /var/www/html/public
exec php -S 0.0.0.0:${APP_PORT} -t .
