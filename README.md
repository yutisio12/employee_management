# Employee App

Fullstack web application using **NestJS + PostgreSQL** (backend) and
**Next.js + shadcn/ui** (frontend).\
Supports JWT authentication, server-side pagination, and modern UI with
shadcn.

------------------------------------------------------------------------

## ✨ Features

### 🔹 Backend (NestJS)

-   JWT authentication
-   PostgreSQL (TypeORM)
-   Employee CRUD
-   Server-side pagination, search, and sort

### 🔹 Frontend (Next.js + shadcn/ui)

-   Responsive UI with Tailwind CSS
-   Dark/Light theme
-   DataTable with server-side pagination
-   Form validation (React Hook Form + Zod)

------------------------------------------------------------------------

## 🛠 Tech Stack

**Frontend** - Next.js 14
- shadcn/ui
- Tailwind CSS
- React Hook Form
- Zod

**Backend** - NestJS
- PostgreSQL
- TypeORM
- JWT Auth

------------------------------------------------------------------------

## 📂 Project Structure

    employee-app/
    ├── backend/                 # NestJS API
    │   ├── src/
    │   │   ├── employee/        # Employee Module
    │   │   ├── auth/            # Auth Module
    │   │   └── main.ts
    │   └── package.json
    │
    ├── frontend/                # Next.js + shadcn UI
    │   ├── app/
    │   │   ├── employees/       # Employees pages
    │   │   ├── components/      # Reusable UI
    │   │   └── layout.tsx
    │   └── package.json
    │
    └── README.md

------------------------------------------------------------------------

## 🚀 Installation

### 1. Clone Repository

``` bash
git clone https://github.com/yutisio12/employee_management.git
cd employee-app
```

### 2. Setup Backend (NestJS)

``` bash
cd backend
cp .env.example .env   # Fill DB_URL PostgreSQL and JWT_SECRET
npm install
npm run start:dev
```

### 3. Setup Frontend (Next.js)

``` bash
cd frontend
cp .env.example .env   # Fill NEXT_PUBLIC_API_URL
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔑 Environment Variables

### Backend (`backend/.env`)

    DB_EMPLOYEE_URL=postgres://user:password@localhost:5432/employee_db
    DB_AUTH_URL=postgres://user:password@localhost:5432/employee_db
    JWT_SECRET=your_jwt_secret
    PORT=3001

### Frontend (`frontend/.env`)

    NEXT_PUBLIC_API_URL=http://localhost:3001

------------------------------------------------------------------------

## 📊 API Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | /api/auth/login        | Login user                 |
| POST   | /api/auth/register     | Register user              |
| POST   | /api/employee/register | Create employee            |
| GET    | /api/employee/list     | List employees (paginated) |
| GET    | /api/employee/\:id     | Get employee by ID         |
| PATCH  | /api/employee/\:id     | Update employee            |
| DELETE | /api/employee/\:id     | Delete employee            |

------------------------------------------------------------------------

## 🎨 UI Preview

-   Employee Table with **server-side pagination**\
-   Dark/Light mode using shadcn/ui\
-   Form modal for add/edit employee

------------------------------------------------------------------------

## 📜 License

MIT © 2025 Yutisio12
