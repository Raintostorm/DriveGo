# DriveGo — Vai trò, điều kiện & hai loại lịch

> Tài liệu ngắn để tránh nhầm giữa thi thử, đăng ký ca thi, và buổi học tại trung tâm.

## Vai trò

| Vai trò | Frontend | API |
|---------|----------|-----|
| `student` | `/student-dashboard`, `/theory`, `/exam`, … | `/study`, `/exams`, `/applications`, `/schedules`, `/sessions` |
| `center_admin` | `/admin-dashboard`, `/admin/*` (không có Centers) | `/admin/*` — scope `users.center_id` |
| `system_admin` | Thêm `/admin/centers` | `/admin/*` — toàn hệ thống |

Staff **không** mua Premium hay học như học viên. Đăng ký trung tâm mới: chỉ `system_admin` qua `/admin/centers` + `POST /admin/users/center-admin`.

## Điều kiện theo tính năng (học viên)

| Tính năng | Điều kiện backend | Route HV |
|-----------|-------------------|----------|
| Học lý thuyết | `course_enrollments.status = active` (hạng đó) | `/theory` |
| Thi thử | Enrolled + Premium hoặc trong giới hạn bài free | `/exam` |
| Nộp / sửa hồ sơ | `draft` hoặc admin yêu cầu nộp lại | `/application` |
| **Đăng ký ca thi** | Hồ sơ `license_applications.status = approved` | `/schedule` |
| **Buổi học & điểm danh** | `student_profiles.center_id` gắn trung tâm | `/study-calendar` |

**Lưu ý:** Thi thử **không** yêu cầu hồ sơ đã duyệt. Đăng ký ca thi **có** yêu cầu hồ sơ approved.

## Hai loại “lịch”

| Khái niệm | Bảng DB | HV | Admin |
|-----------|---------|-----|-------|
| **Ca thi / chạy thử** | `schedule_slots`, `exam_registrations` | `/schedule` | `/admin/schedules` (duyệt), `/admin/schedules/slots` (tạo ca) |
| **Buổi học lớp** | `class_sessions`, `session_attendance` | `/study-calendar` | `/admin/class-sessions` |

Sức chứa ca thi: đếm cả đăng ký `pending` và `confirmed` (tránh overbooking trước khi admin duyệt). `registered_count` trên slot chỉ tăng khi admin **xác nhận**.

## Ca thi — học viên đã đăng nhập

- Danh sách ca lọc theo `student_profiles.center_id` (nếu đã gắn trung tâm).
- Khách (chưa login) vẫn có thể xem catalog marketing (tất cả ca).

## CMS / khóa học

- `center_admin`: xem nội dung khóa (GET).
- `system_admin`: chỉnh chapter, học phí (`PATCH`).

## Demo

Sau `npm run reset:db`: `student@drivego.demo`, `center@drivego.demo`, `admin@drivego.demo` — mật khẩu `DriveGo123!`.
