# FreelanceHub Backend API

Laravel 12 REST API for the FreelanceHub platform.

## Tech Stack

- **Laravel 12**
- **PHP 8.3+**
- **SQLite** (development database)
- **Laravel Sanctum** (authentication)

## Quick Start with Docker

```bash
# Build image
docker build -t freelancehub-backend .

# Run container
docker run -d --name freelancehub-backend -p 8000:8000 freelancehub-backend
```

The container will automatically:
- Install dependencies
- Run migrations
- Seed the database
- Start the Laravel server on port 8000

## Local Development Setup

### Prerequisites
- PHP 8.3+
- Composer
- SQLite

### Installation

1. **Install dependencies:**
```bash
composer install
```

2. **Set up environment:**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Create database:**
```bash
touch database/database.sqlite
```

4. **Run migrations and seeders:**
```bash
php artisan migrate --seed
```

5. **Start server:**
```bash
php artisan serve
```

API will be available at: http://127.0.0.1:8000

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication
Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

### Endpoints

#### Public Routes

**Health Check**
```
GET /api/ping
```

**Jobs**
```
GET /api/jobs              # List all jobs (paginated)
GET /api/jobs/{id}         # Get job details
```

**Users**
```
GET /api/users              # List all users (paginated)
GET /api/users/{id}        # Get user details
POST /api/users            # Create user (register)
```

**Authentication**
```
POST /api/register         # Register new user
POST /api/login            # Login user
```

#### Protected Routes (Requires Authentication)

**User**
```
GET /api/me                # Get current authenticated user
POST /api/logout           # Logout current user
```

**Jobs** (Authenticated users only)
```
POST /api/jobs             # Create new job (clients only)
PUT /api/jobs/{id}         # Update job
DELETE /api/jobs/{id}      # Delete job
```

**Dashboards**
```
GET /api/dashboard/client      # Client dashboard (clients only)
GET /api/dashboard/freelancer # Freelancer dashboard (freelancers only)
```

**Proposals**
```
GET /api/jobs/{job}/proposals  # Get proposals for a job
POST /api/jobs/{job}/proposals # Submit proposal (freelancers only)
GET /api/proposals/{id}        # Get proposal details
PUT /api/proposals/{id}        # Update proposal
DELETE /api/proposals/{id}     # Delete proposal
```

**Freelancer Profiles**
```
GET /api/freelancer-profiles           # List all profiles
GET /api/freelancer-profiles/{id}      # Get profile details
POST /api/freelancer-profiles          # Create profile
PUT /api/freelancer-profiles/{id}      # Update profile
DELETE /api/freelancer-profiles/{id}   # Delete profile
```

## Database

### Migrations
```bash
php artisan migrate
```

### Seeders
```bash
php artisan db:seed
```

The seeders create:
- 20 sample users (mix of clients and freelancers)
- 15 sample jobs

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/          # API controllers
│   └── Models/               # Eloquent models
├── database/
│   ├── migrations/            # Database migrations
│   ├── seeders/               # Database seeders
│   └── factories/             # Model factories
├── routes/
│   └── api.php                # API routes
└── Dockerfile                 # Docker configuration
```

## Docker Commands

```bash
# Build image
docker build -t freelancehub-backend .

# Run container
docker run -d --name freelancehub-backend -p 8000:8000 freelancehub-backend

# View logs
docker logs freelancehub-backend

# Execute commands in container
docker exec freelancehub-backend php artisan {command}

# Stop container
docker stop freelancehub-backend

# Start container
docker start freelancehub-backend

# Remove container
docker rm freelancehub-backend
```

## Environment Variables

Key variables in `.env`:
```env
APP_KEY=base64:...
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

## Testing

```bash
php artisan test
```

## Code Style

All code comments and documentation are in English.
