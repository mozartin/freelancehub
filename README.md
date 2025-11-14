# FreelanceHub

FreelanceHub is a full-stack web platform for connecting freelancers with clients.  
The project is built with **Laravel 12 (REST API)** on the backend and **React + Vite** on the frontend.

This is a personal portfolio project focused on clean architecture, modern tooling, and real-world functionality (job listings, proposals, user profiles, etc.).

---

## Tech Stack

### **Backend**
- Laravel 12  
- PHP 8+  
- SQLite (development)  
- REST API structure  
- Eloquent Models  
- Migrations + Seeders  

### **Frontend**
- React  
- Vite  
- Fetch API for backend communication  
- Modern functional components + hooks  

---

## Project Structure
freelancehub/
backend/ # Laravel API
frontend/ # React + Vite app


## Setup Instructions

### **1. Clone the repository**
```bash
git clone https://github.com/mozartin/freelancehub.git
cd freelancehub

Backend Setup (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

Backend will run on:

http://127.0.0.1:8000

Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

Frontend will run on:

http://127.0.0.1:5173