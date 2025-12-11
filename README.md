# FreelanceHub

FreelanceHub is a full-stack web platform for connecting freelancers with clients.  
The project is built with **Laravel 12 (REST API)** on the backend and **React + Vite** on the frontend.

This is a personal portfolio project focused on clean architecture, modern tooling, and real-world functionality (job listings, proposals, user profiles, etc.).

---

## Tech Stack

### **Backend**
- Laravel 12  
- PHP 8.3+  
- SQLite (development)  
- REST API structure  
- Eloquent Models  
- Migrations + Seeders  
- Laravel Sanctum (authentication)

### **Frontend**
- React  
- Vite  
- React Router  
- Axios for backend communication  
- Modern functional components + hooks  

---

## Project Structure
```
freelancehub/
├── backend/          # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── Dockerfile
└── frontend/         # React + Vite app
    ├── src/
    └── public/
```

---

## Setup Instructions

### **Option 1: Docker Setup (Recommended)**

#### **Backend with Docker**

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the Docker image:
```bash
docker build -t freelancehub-backend .
```

3. Run the container:
```bash
docker run -d --name freelancehub-backend -p 8000:8000 freelancehub-backend
```

The backend will automatically:
- Run migrations
- Seed the database with sample data
- Start the Laravel development server

**Backend API:** http://localhost:8000

**Useful Docker commands:**
```bash
# View logs
docker logs freelancehub-backend

# Stop container
docker stop freelancehub-backend

# Start container
docker start freelancehub-backend

# Remove container
docker rm freelancehub-backend

# Run seeders manually (if needed)
docker exec freelancehub-backend php artisan db:seed --force
```

#### **Frontend Setup (Local)**

```bash
cd frontend
npm install
npm run dev
```

**Frontend:** http://localhost:5173

---

### **Option 2: Local Setup (Without Docker)**

#### **Backend Setup (Laravel)**

**Prerequisites:**
- PHP 8.3+
- Composer
- SQLite

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Set up environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Create database file:
```bash
touch database/database.sqlite
```

5. Run migrations and seeders:
```bash
php artisan migrate --seed
```

6. Start the server:
```bash
php artisan serve
```

**Backend API:** http://127.0.0.1:8000

#### **Frontend Setup (React + Vite)**

**Prerequisites:**
- Node.js 18+
- npm

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

**Frontend:** http://localhost:5173

---

## API Endpoints

### **Public Endpoints**
- `GET /api/ping` - Health check
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get job details
- `GET /api/users` - List users
- `GET /api/users/{id}` - Get user details
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### **Protected Endpoints** (Requires authentication)
- `GET /api/me` - Get current user
- `POST /api/logout` - Logout user
- `POST /api/jobs` - Create job (clients only)
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job
- `GET /api/dashboard/client` - Client dashboard
- `GET /api/dashboard/freelancer` - Freelancer dashboard
- `POST /api/jobs/{job}/proposals` - Submit proposal (freelancers only)

---

## Database

The project uses **SQLite** for development. The database file is located at:
- `backend/database/database.sqlite`

**Seeders:**
- Creates 20 sample users (clients and freelancers)
- Creates 15 sample jobs
- All data is generated using Faker

---

## Environment Variables

### Backend (.env)
Key variables:
- `APP_KEY` - Application encryption key (auto-generated)
- `DB_CONNECTION=sqlite` - Database connection
- `DB_DATABASE=database/database.sqlite` - Database file path

---

## Development Notes

- The backend runs migrations and seeders automatically on Docker container start
- Authentication uses Laravel Sanctum tokens
- All API responses are in JSON format
- The frontend uses React Router for navigation
- Protected routes require authentication token in headers