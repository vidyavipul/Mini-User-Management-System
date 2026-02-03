Mini User Management System

A full-stack web application for managing user accounts with JWT authentication, role-based access control (RBAC), and admin user management. 
---

📋 Project Overview

This system allows:
- Users to **sign up**, **log in**, view/update their profile, and change passwords.
- Admins to **view all users** (paginated), **activate/deactivate** accounts.
- Protected routes with JWT authentication and role-based authorization.

---

🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, React Router DOM          |
| Backend    | Node.js, Express 5                  |
| Database   | MongoDB (Mongoose ODM)              |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| Testing    | Jest, Supertest, mongodb-memory-server |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas |

---

📁 Project Structure

```
Mini-User-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, constants
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Validators
│   │   ├── app.js           # Express app
│   │   └── index.js         # Server entry
│   ├── scripts/             # Admin seeder
│   ├── tests/               # Jest tests
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client helpers
│   │   ├── components/      # UI components
│   │   ├── context/         # Auth context
│   │   ├── App.js           # Main app with routes
│   │   └── App.css          # Styles
│   └── package.json
└── README.md
```

---

⚙️ Environment Variables

Backend (`backend/.env`)

| Variable      | Description                     |
|---------------|---------------------------------|
| `PORT`        | Server port (default: 5001)     |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET`  | Secret for signing JWT tokens   |

Frontend (`frontend/.env`)

| Variable                  | Description                        |
|---------------------------|------------------------------------|
| `REACT_APP_API_BASE_URL`  | Backend API URL (default: http://localhost:5001) |

---

🏃 Setup Instructions

Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Frontend Setup

```bash
cd frontend
npm install
npm start
```

Run Tests

```bash
cd backend
npm test
```

Promote a User to Admin

```bash
cd backend
npm run make-admin -- --email=user@example.com
```

---

 🔌 API Documentation

Base URL: `http://localhost:5001` (or deployed URL)

Authentication

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| POST   | `/api/auth/signup` | Register a new user      | No            |
| POST   | `/api/auth/login`  | Login and get JWT        | No            |
| GET    | `/api/auth/me`     | Get current user info    | Yes           |
| POST   | `/api/auth/logout` | Logout (client-side)     | No            |

User Management

| Method | Endpoint                      | Description              | Auth Required |
|--------|-------------------------------|--------------------------|---------------|
| GET    | `/api/users`                  | List users (paginated)   | Admin only    |
| GET    | `/api/users/me`               | Get own profile          | Yes           |
| PATCH  | `/api/users/me`               | Update name/email        | Yes           |
| PATCH  | `/api/users/me/password`      | Change password          | Yes           |
| PATCH  | `/api/users/:id/activate`     | Activate a user          | Admin only    |
| PATCH  | `/api/users/:id/deactivate`   | Deactivate a user        | Admin only    |

Example Requests

<details>
<summary>POST /api/auth/signup</summary>

Request:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

Response (201):
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }
}
```
</details>

<details>
<summary>POST /api/auth/login</summary>

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```
</details>

<details>
<summary>GET /api/users (Admin)</summary>

**Headers:** `Authorization: Bearer <token>`

**Query:** `?page=1&limit=10`

**Response (200):**
```json
{
  "data": [ { "email": "...", "fullName": "...", "role": "...", "status": "..." } ],
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```
</details>

---

🚀 Deployment Instructions

Backend (Render)

1. Push code to GitHub.
2. Create a new Web Service on [Render](https://render.com).
3. Connect your repo, set root directory to `backend`.
4. Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`).
5. Deploy.

Frontend (Vercel)

1. Push code to GitHub.
2. Import project on [Vercel](https://vercel.com).
3. Set root directory to `frontend`.
4. Add env var `REACT_APP_API_BASE_URL` pointing to your backend URL.
5. Deploy.

Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Whitelist IPs (or allow all: `0.0.0.0/0`).
3. Create a database user and get the connection string.

---

✅ Features Checklist

- [x] User signup with validation
- [x] User login with JWT
- [x] Protected routes (auth required)
- [x] Role-based access (admin/user)
- [x] Admin: list users with pagination
- [x] Admin: activate/deactivate users
- [x] User: view/edit profile
- [x] User: change password
- [x] Password hashing (bcrypt)
- [x] Input validation
- [x] Consistent error responses
- [x] Environment variables
- [x] Backend unit tests (5+)
- [x] Responsive UI
- [x] Loading states & toast notifications

---

📄 License

ISC
