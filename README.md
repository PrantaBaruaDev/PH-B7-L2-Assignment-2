# ⚡ DevPulse — Internal Tech Issue & Feature Tracker

> A collaborative backend platform for software teams to report bugs, suggest features, and coordinate resolutions — built with Node.js, TypeScript, Express.js, and PostgreSQL.

---
# 👨‍💻 Author
### Name: Pranta Barua
### Assignment: 2
### Batch: L2B7

---

## 🔗 Live URL

[https://dev-pluse-five.vercel.app/](https://dev-pluse-five.vercel.app/)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup & login with token-based auth
- 👥 **Role-Based Access Control** — `contributor` and `maintainer` roles with distinct permissions
- 🐛 **Issue Management** — Create, read, update, and delete bug reports & feature requests
- 🔍 **Filtering & Sorting** — Filter issues by `type`, `status`; sort by `newest` or `oldest`
- 🔒 **Password Security** — bcrypt hashing (salt rounds: 10)
- 🧱 **Modular Architecture** — Clean separation of concerns with modules, middleware, config, and utils
- 🚫 **No ORM / No SQL JOIN** — Raw SQL with `pool.query()` only
- ✅ **Consistent API Responses** — Standardized success/error response structure throughout

---

## 🛠️ Tech Stack

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| Node.js (LTS)    | Runtime environment                  |
| TypeScript       | Type-safe development                |
| Express.js       | Web framework (modular router)       |
| PostgreSQL        | Relational database (NeonDB)        |
| `pg` (node-postgres) | Native PostgreSQL driver         |
| bcrypt           | Password hashing                     |
| jsonwebtoken     | JWT generation & verification        |
| dotenv           | Environment variable management      |

---

## 📁 Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Server entry point
├── errors/                   # Async error wrapper
│   └── AppError.ts           # Prepare error message with status code
├── config/
│   └── schema.ts             # PostgreSQL database create with pool configuration
├── middleware/
│   ├── auth.ts                 # JWT verification & Role-based authorization
│   ├── globalErrorHandler.ts   # Standardized error response formatter
│   ├── index.d.ts              # it's use for help to set JWT payload card on `Request`
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   |── issues/
│   |   ├── issues.routes.ts
│   |   ├── issues.controller.ts
│   |   └── issues.service.ts
│   |   └── issues.interface.ts
│   └── users/
│       ├── users.routes.ts
│       ├── users.controller.ts
│       └── users.service.ts
│       └── users.interface.ts
└── types/
    ├── index.ts  
└── utils/
    ├── sendResponse.ts       # Standardized response formatter
    └── jwt.ts                
```

---

## 🗄️ Database Schema

### Table: `users`

| Column       | Type                              | Constraints                          |
| ------------ | --------------------------------- | ------------------------------------ |
| `id`         | `SERIAL`                          | PRIMARY KEY                          |
| `name`       | `VARCHAR(20)`                     | NOT NULL                             |
| `email`      | `VARCHAR(50)`                     | UNIQUE, NOT NULL                     |
| `password`   | `TEXT`                            | NOT NULL (bcrypt hashed)             |
| `role`       | `VARCHAR(15)`                     | DEFAULT `'contributor'`, NOT NULL    |
| `created_at` | `TIMESTAMP`                       | DEFAULT `CURRENT_TIMESTAMP`          |
| `updated_at` | `TIMESTAMP`                       | DEFAULT `CURRENT_TIMESTAMP`          |

### Table: `issues`

| Column        | Type           | Constraints                          |
| ------------- | -------------- | ------------------------------------ |
| `id`          | `SERIAL`       | PRIMARY KEY                          |
| `title`       | `VARCHAR(150)` | NOT NULL                             |
| `description` | `TEXT`         | NOT NULL `(min 20 chars)`            |
| `type`        | `VARCHAR(20)`  | `'bug'`, `'feature_request'` or `'resolved'`       |
| `status`      | `VARCHAR(15)`  | DEFAULT `'open'`                     |
| `reporter_id` | `INTEGER`      | NOT NULL (validated in app logic)    |
| `created_at`  | `TIMESTAMP`    | DEFAULT `CURRENT_TIMESTAMP`          |
| `updated_at`  | `TIMESTAMP`    | DEFAULT `CURRENT_TIMESTAMP`          |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

- Node.js v24.x or higher
- PostgreSQL running locally
- `npm` 

### 1. Clone the repository

```bash
git clone https://github.com/PrantaBaruaDev/PH-B7-L2-Assignment-2.git
cd PH-B7-L2-Assignment-2
```
### 2. Install dependencies

```bash
npm install
```
## Package Install

```bash
npm i -g typescript 
npm i tsx 
npm i express 
npm i tsup // for build project
npm i dotenv 
npm i pg 
npm i bcryptjs 
npm i jsonwebtoken 
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/devpulse
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Set up the database

Run the following SQL in your PostgreSQL client (psql / pgAdmin):

```sql
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(15) CHECK (role IN ('contributor', 'maintainer')) DEFAULT 'contributor' NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) >= 20),
    type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')) NOT NULL,
    status VARCHAR(15) CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open' NOT NULL,
    reporter_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Run the development server

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

### 6. Build for production

```bash
npm run build
npm start
```

---

## 🌐 API Endpoints

### Base URL
```
https://dev-pluse-five.vercel.app/api
```

### 🔹 Authentication

| Method | Endpoint           | Access  | Description              |
| ------ | ------------------ | ------- | ------------------------ |
| POST   | `/auth/signup`     | Public  | Register a new user      |
| POST   | `/auth/login`      | Public  | Login and receive JWT    |

### 🔹 Issues

| Method | Endpoint         | Access                        | Description                              |
| ------ | ---------------- | ----------------------------- | ---------------------------------------- |
| POST   | `/issues`        | Authenticated                 | Create a new issue                       |
| GET    | `/issues`        | Public                        | Get all issues (with filters & sorting)  |
| GET    | `/issues/:id`    | Public                        | Get a single issue by ID                 |
| PATCH  | `/issues/:id`    | Maintainer / Contributor (own, status = open) | Update an issue                 |
| DELETE | `/issues/:id`    | Maintainer only               | Delete an issue                          |

### Query Parameters for `GET /api/issues`

| Param    | Values                            | Default   |
| -------- | --------------------------------- | --------- |
| `sort`   | `newest`, `oldest`                | `newest`  |
| `type`   | `bug`, `feature_request`          | _(none)_  |
| `status` | `open`, `in_progress`, `resolved` | _(none)_  |

**Examples:**
```
GET /api/issues?sort=newest
GET /api/issues?type=bug
GET /api/issues?status=open
GET /api/issues?type=bug&status=open&sort=oldest
```

---

## 📋 Request & Response Examples

### GET `/api/issues`

**Response (200)**

```json
{
  "success": true,
  "message": "Issues retrived successfully",
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T14:45:00Z"
    }
  ]
}
```
---

### GET `/api/issues/:id`

**Response (200)**

```json
{
  "success": true,
  "message": "Issue retrived successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

### POST `/api/auth/signup`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@devpulse.com",
  "password": "securePass123",
  "role": "contributor"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@devpulse.com",
    "role": "contributor",
    "created_at": "2026-05-22T10:00:00Z",
    "updated_at": "2026-05-22T10:00:00Z"
  }
}
```

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "john@devpulse.com",
  "password": "securePass123"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

### POST `/api/issues`
**Headers:** `Authorization: <JWT_TOKEN>`

**Request:**
```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-05-22T10:30:00Z",
    "updated_at": "2026-05-22T10:30:00Z"
  }
}
```

### PATCH `/api/issues/:id`
**Headers:** `Authorization: <JWT_TOKEN>`

**Request:**
```json
{
  "title": "Updated: Database pool exhaustion fix needed",
  "description": "Updated description with reproduction steps...",
  "type": "bug"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": 45,
    "title": "Updated: Database pool exhaustion fix needed",
    "description": "Updated description with reproduction steps...",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-05-22T10:30:00Z",
    "updated_at": "2026-05-22T10:30:00Z"
  }
}
```

### DELETE `/api/issues/:id`
**Headers:** `Authorization: <JWT_TOKEN>`

**Response (200):**
```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

## 👥 Role & Permission Matrix

| Action                        | `contributor`              | `maintainer` |
| ----------------------------- | -------------------------- | ------------ |
| Register / Login              | ✅                          | ✅            |
| Create issue                  | ✅                          | ✅            |
| View all issues               | ✅                          | ✅            |
| Update **own** issue (open)   | ✅                          | ✅            |
| Update **any** issue          | ❌                          | ✅            |
| Delete issue                  | ❌                          | ✅            |
| Change issue status           | ❌                          | ✅            |

---

## ✅ Success Response Format

All Success responses follow this structure:

```json
{
  "success": true,
  "message": "Operation description",
  "data": "Response data"
}
```

## ⚠️ Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error information" // (Only Development Environment)
}
```

| Status Code | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| `200`       | Good Response OK - Successful GET, PATCH, PUT, DELETE         |
| `201`       | Create Data - Created	Successful POST (resource created)      |
| `204`       | No Content -	Successful DELETE with no response body         |
| `400`       | Bad Request — validation error, duplicate resource            |
| `401`       | Unauthorized — missing, expired, or invalid JWT               |
| `403`       | Forbidden — valid token but insufficient role/permissions     |
| `404`       | Not Found — resource does not exist                           |
| `409`       | Conflict — editing a non-open issue as contributor            |
| `500`       | Internal Server Error — unexpected server/database error      |

---

## 👨‍💻 Author

### **Pranta Barua**

Batch: L2B7 — Programming Hero

---

<p align="center">Built with ❤️ for the Programming Hero Level 2 — Batch 7 Assignment</p>