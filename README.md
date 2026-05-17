# ⚡ GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and clean architecture principles.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, Zustand, React Router v6 |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| DevOps | Docker + Docker Compose + nginx |

---

## ✅ Features

### Core
- **JWT Authentication** — Register, login, protected routes, auth middleware
- **Leads CRUD** — Create, read, update, delete leads with full validation
- **Advanced Filtering** — Filter by status, source, search by name/email, sort by date — all composable
- **Backend Pagination** — 10 records/page with full metadata (skip/limit)
- **Responsive UI** — Works on mobile, tablet, and desktop
- **Loading & Empty States** — Skeleton loaders, empty state illustrations, error boundaries

### Mandatory Additional Features
- **Debounced Search** — 400ms debounce on name/email search
- **CSV Export** — One-click export of all leads (role-filtered)
- **Role-Based Access Control** — Admin sees all leads; Sales users see only their own
- **Docker Setup** — Full `docker-compose.yml` with MongoDB, backend, and frontend (nginx)

### Bonus
- **Dark Mode** — Full dark mode with system-preference toggle, persisted to localStorage

---

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # authController, leadsController
│   │   ├── middleware/      # auth, errorHandler, validation
│   │   ├── models/         # User, Lead (Mongoose schemas)
│   │   ├── routes/         # auth.ts, leads.ts
│   │   ├── types/          # Shared TypeScript interfaces
│   │   └── index.ts        # Express app entry
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # ProtectedRoute, PublicRoute
│   │   │   ├── layout/     # Navbar
│   │   │   ├── leads/      # LeadForm, LeadRow, LeadDetail, FiltersBar, Pagination, StatsCards
│   │   │   └── ui/         # Button, Input, Select, Modal, Badge, States
│   │   ├── hooks/          # useLeads, useDebounce
│   │   ├── pages/          # LoginPage, RegisterPage, DashboardPage
│   │   ├── services/       # api.ts, authService.ts, leadsService.ts
│   │   ├── store/          # authStore (Zustand), themeStore
│   │   ├── types/          # Shared TypeScript types
│   │   └── utils/          # cn(), formatDate(), STATUS_CONFIG, etc.
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🛠 Local Setup (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/gigflow.git
cd gigflow
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

The API will run at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

---

## 🐳 Docker Setup

```bash
# From the project root
cp backend/.env.example backend/.env
# Edit backend/.env with your JWT_SECRET

docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/gigflow` |
| `JWT_SECRET` | JWT signing secret | *(required)* |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `/api` (proxied via Vite) |

---

## 📡 API Overview

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login |
| GET | `/auth/me` | ✅ | Get current user |

### Leads
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/leads` | ✅ | Any | List leads (filtered, paginated) |
| POST | `/leads` | ✅ | Any | Create lead |
| GET | `/leads/stats` | ✅ | Any | Get stats summary |
| GET | `/leads/export` | ✅ | Any | Export CSV |
| GET | `/leads/:id` | ✅ | Any | Get single lead |
| PUT | `/leads/:id` | ✅ | Any | Update lead |
| DELETE | `/leads/:id` | ✅ | Any | Delete lead |

> **RBAC**: Admin sees all leads. Sales users only see leads they created.

---

## 🧪 TypeScript Standards

- All types/interfaces are defined in `src/types/index.ts` (no implicit `any`)
- Mongoose documents use properly typed `Document` interfaces
- Express request objects extended via `AuthRequest` interface
- All API responses typed with `ApiResponse<T>` generic

---

## 🌗 Dark Mode

Toggle via the moon/sun icon in the navbar. Preference is persisted using Zustand's `persist` middleware (localStorage).

---

## 📤 CSV Export

Click **Export CSV** in the dashboard header. The file is downloaded as `leads-YYYY-MM-DD.csv`. Role-based: admin exports all leads; sales users export only their own.

---

## 🏗 Architecture Decisions

- **Zustand** over Redux — lighter, less boilerplate, easier to test
- **Debounced search at 400ms** — balances responsiveness and API call volume
- **Backend pagination with skip/limit** — returns `meta` object with total, page, totalPages, hasNextPage, hasPrevPage
- **Mongoose indexes** on `status`, `source`, `createdAt`, and text index on `name`/`email` for performant queries
- **Centralized error handling** — single Express error middleware handles Mongoose validation, cast errors, and duplicate keys
- **Rate limiting** — 100 requests per 15 minutes via `express-rate-limit`

---

## 📬 Submission

Built for the ServiceHive Full Stack Internship Assignment.

**Submitted by:** [Your Name]  
**Email:** [your.email@example.com]
