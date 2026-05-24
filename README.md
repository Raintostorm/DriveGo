# DriveGo

Monorepo nền tảng học lái xe — frontend React, backend NestJS, database schema riêng.

## Cấu trúc

```text
DriveGo/
├── frontend/    # React + Vite + Tailwind
├── backend/     # NestJS REST API
├── database/    # Schema SQL, migrations, seeds (placeholder)
└── docs/        # Tài liệu dùng chung
```

## Chạy local

```bash
npm install
npm run dev          # FE :5173 + BE :3000
npm run dev:fe       # chỉ frontend
npm run dev:be       # chỉ backend
```

## Scripts root

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Frontend + backend song song |
| `npm run build` | Build cả hai package |
| `npm run lint` | Lint frontend + typecheck backend |

## Env

- `frontend/.env.example` — `VITE_API_URL`
- `backend/.env.example` — `PORT`, `CORS_ORIGIN`, `DATABASE_URL`, `JWT_SECRET`
- `database/.env.example` — `DATABASE_URL` (khi có DB)

## Tài liệu

- [Kiến trúc](docs/architecture.md)
- [Domain từ UI](docs/domain-from-ui.md)
- [Figma map](docs/figma-map.md)

## Database

Schema placeholder trong `database/schema/`. Khi có connection string, điền `.env` và chạy migration theo `database/README.md`.
