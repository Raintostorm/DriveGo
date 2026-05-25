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

- **[Hướng dẫn cài đặt & seed database](docs/HUONG-DAN-CAI-DAT.md)** (tiếng Việt)
- [Kiến trúc](docs/architecture.md)
- [Domain từ UI](docs/domain-from-ui.md)
- [Figma map](docs/figma-map.md)

## Database

```bash
npm run setup:env    # tạo .env từ example
npm run test:db      # kiểm tra kết nối PostgreSQL
npm run seed:db      # tài khoản demo + dữ liệu mẫu
npm run reset:db     # làm sạch DB + migration + seed + import A1–B2
```

Chi tiết: [docs/HUONG-DAN-CAI-DAT.md](docs/HUONG-DAN-CAI-DAT.md), [database/seeds/README.md](database/seeds/README.md).

Tích hợp bên thứ ba (Firebase, thanh toán, AI): [docs/integrations.md](docs/integrations.md)
