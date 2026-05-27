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
    PG[(PostgreSQL)]
    SQL[schema_migrations_seeds]
  end
  React -->|VITE_API_URL| Nest
  Nest --> PG
  SQL --> PG
```

## Folder

| Folder | Trách nhiệm |
|--------|-------------|
| `frontend/` | UI, routing (`/` = landing), copy tiếng Việt, gọi API qua `src/lib/api.js` |
| `backend/` | REST `/api/*`, auth, business logic (TypeORM + PostgreSQL) |
| `database/` | DDL, migrations, seeds, import nội dung đề thi |
| `docs/` | Spec domain, [roles-and-schedules.md](./roles-and-schedules.md), project-recap |

## Backend modules (NestJS) — trạng thái hiện tại

| Module | Route prefix | Trạng thái |
|--------|--------------|------------|
| health | `/api/health` | Hoạt động |
| auth | `/api/auth` | Login, register, Google (JWT) |
| users | `/api/users` | `GET/PATCH /me` |
| study | `/api/study` | Chương, tiến độ (gate enrolled) |
| exams | `/api/exams` | Đề thi, nộp bài, lịch sử (gate enrolled + premium limit) |
| schedules | `/api/schedules` | Ca thi, đăng ký (gate hồ sơ approved); optional JWT lọc theo center |
| sessions | `/api/sessions` | Buổi học, điểm danh HV |
| applications | `/api/applications` | Hồ sơ sát hạch + upload |
| payments | `/api/payments` | SePay checkout + webhook |
| enrollments | `/api/enrollments` | Khóa học theo hạng |
| admin | `/api/admin/*` | Portal center/system (scope `center_id`) |
| notifications | `/api/notifications` | Thông báo in-app |
| articles | `/api/articles` | Tài liệu / blog |
| plans | `/api/plans` | Catalog + Premium |
| lookup | `/api/lookup` | Tra cứu |
| chat | `/api/chat` | AI (Premium; Gemini nếu có API key) |

**Đã gỡ:** `/api/centers/*` stub — quản lý trung tâm qua `/api/admin/centers` (system_admin).

## Auth & roles

- `POST /api/auth/login`, `POST /api/auth/register` — bcrypt + JWT
- `GET /api/users/me` — Bearer token (`centerName` cho staff)
- Roles: `student`, `center_admin`, `system_admin`
- Chi tiết điều kiện từng luồng: [roles-and-schedules.md](./roles-and-schedules.md)

## Landing mặc định

- `http://localhost:5173/` → `HomePage` (marketing layout)
- `/home` redirect về `/`

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
GEMINI_API_KEY=          # tùy chọn — AI chat
```

## Demo

`npm run reset:db` → `student@drivego.demo`, `center@drivego.demo`, `admin@drivego.demo` / `DriveGo123!`
