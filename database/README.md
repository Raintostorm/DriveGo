# Database — DriveGo

Schema và migration tách riêng khỏi NestJS. **Chưa chạy** cho đến khi bạn cung cấp connection string.

## Cấu trúc

```text
database/
├── schema/drivego.schema.sql   # DDL tham chiếu (Postgres-flavored)
├── migrations/                 # SQL từng bước (001_init.sql, ...)
├── seeds/                      # Dữ liệu demo (optional)
└── .env.example
```

## Khi có database

1. Copy `.env.example` → `.env` và điền `DATABASE_URL`.
2. Tạo database trống (ví dụ `drivego`).
3. Chạy schema hoặc migration:

```bash
# PostgreSQL ví dụ
psql "$DATABASE_URL" -f database/schema/drivego.schema.sql
npm run seed:db
```

4. Báo Agent bật TypeORM/Prisma trong `backend/` và nối API thật.

## Ghi chú

- File SQL hiện dùng cú pháp gần **PostgreSQL** (`UUID`, `TIMESTAMPTZ`). Điều chỉnh khi bạn chọn MySQL/SQL Server.
- NestJS **chưa** kết nối DB trong phase skeleton.
