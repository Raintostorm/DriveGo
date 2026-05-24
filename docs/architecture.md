# Kiến trúc DriveGo (monorepo)

## Tổng quan

```mermaid
flowchart TB
  subgraph client [frontend]
    React[React_Vite_5173]
  end
  subgraph api [backend]
    Nest[NestJS_3000_api]
  end
  subgraph data [database]
    SQL[schema_migrations_seeds]
  end
  React -->|VITE_API_URL| Nest
  Nest -->|DATABASE_URL_sau| SQL
```

## Folder

| Folder | Trách nhiệm |
|--------|-------------|
| `frontend/` | UI, routing, copy tiếng Việt, gọi API qua `src/lib/api.js` |
| `backend/` | REST `/api/*`, auth, business logic (skeleton hiện tại) |
| `database/` | DDL, migrations, seeds — tách khỏi Nest để dễ review SQL |
| `docs/` | Spec domain, Figma map, architecture |

## Backend modules (NestJS)

| Module | Route prefix | Trạng thái |
|--------|--------------|------------|
| health | `/api/health` | Hoạt động |
| auth | `/api/auth` | Login, register (PostgreSQL + JWT) |
| users | `/api/users` | `GET /me` (JWT) |
| lookup | `/api/lookup` | Tra cứu từ DB |
| exams | `/api/exams` | Stub |
| schedules | `/api/schedules` | Stub |
| notifications | `/api/notifications` | Stub |
| articles | `/api/articles` | Stub |
| plans | `/api/plans` | Stub |
| centers | `/api/centers` | Stub |
| chat | `/api/chat` | Stub |

## Auth flow (đã bật)

- `POST /api/auth/login`, `POST /api/auth/register` — bcrypt + JWT
- `GET /api/users/me` — Bearer token
- Frontend: `AuthProvider`, trang dashboard yêu cầu đăng nhập
- Demo: `student@drivego.demo` / `DriveGo123!` (sau `npm run seed:db`)

## Biến môi trường

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (`backend/.env`)

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/DriveGo
JWT_SECRET=change-me
```

## Bước tiếp

1. Implement API: `exams`, `history`, `notifications`, `schedules` từ PostgreSQL.
2. Thay mock data trên các trang dashboard bằng gọi API.
3. Payment / OAuth / AI (xem `docs/integrations.md`).
