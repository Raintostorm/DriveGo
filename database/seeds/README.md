# Demo seed data

Chạy sau khi schema đã apply:

```bash
npm run seed:db
```

## Tài khoản test

| Email | Mật khẩu | Role |
|-------|----------|------|
| student@drivego.demo | DriveGo123! | Học viên |
| center@drivego.demo | DriveGo123! | Quản trị trung tâm |
| admin@drivego.demo | DriveGo123! | Quản trị hệ thống |

## Tra cứu (Lookup)

- `079095001234`, `HV-101` — Nguyễn Văn An (Đạt)
- `079095009999` — Trần Thị Bích (Đang chờ)
- `HV-205` — Lê Hoàng Nam (Không đạt)
- `079095008888` — Phạm Minh Đức (A1, Đạt)

## Dữ liệu mẫu (sau seed)

| Loại | Số lượng |
|------|----------|
| Đề thi B2 | 2 đề × 10 câu |
| Chương lý thuyết + video | 4 chương |
| Lịch sử thi | 5 lần |
| Thông báo | 8 |
| Bài viết tài liệu | 6 |
| Ca thi (schedule) | 5 |
| Phiên AI chat | 3 |
| Tra cứu | 5 mã |

Chạy lại seed sẽ **xóa và tạo lại** dữ liệu demo (`@drivego.demo`).
