## DriveGo – Checklist kiểm tra lần cuối

### 1. Auth & bảo mật

- **JWT_SECRET**
  - Backend chỉ khởi động khi `JWT_SECRET` được set, khác `change-me`, dài ≥ 16 ký tự.
- **Register / role**
  - `POST /api/auth/register` luôn tạo user `student` (không có cách public nào tạo admin/center_admin).
- **Admin scope**
  - Đăng nhập bằng `center@drivego.demo`:
    - Vào `/admin/students`, `/admin/applications`, `/admin/schedules`, `/admin/schedules/slots`.
    - Không thấy dữ liệu của trung tâm khác.
  - Với tài khoản `center_admin` chưa gắn `center_id`, tất cả API `/api/admin/*` trả `403` với thông báo “Tài khoản trung tâm chưa gắn center_id”.

### 2. Payments & webhook SePay

- **Checkout**
  - Học viên vào `/enroll?class=B2`:
    - `paymentType: enrollment`, bắt buộc chọn hạng.
  - Vào `/upgrade`:
    - `paymentType: premium`, yêu cầu `planCode`.
- **Webhook bảo mật**
  - Ở môi trường non-dev:
    - Nếu thiếu cả `SEPAY_WEBHOOK_API_KEY` và `SEPAY_WEBHOOK_HMAC_SECRET` → webhook `/api/payments/sepay/webhook` trả lỗi 401.
    - Khi cấu hình đúng API key hoặc HMAC, webhook hợp lệ mới được chấp nhận.

### 3. Lịch thi & concurrency

- **Student flow**
  - Học viên có hồ sơ `approved`:
    - `/schedule` hiển thị các ca đúng trung tâm của mình (nếu có), `remaining` không âm.
    - Đăng ký ca thi khi còn chỗ → trạng thái `pending`, message “Đã gửi yêu cầu, chờ trung tâm xác nhận”.
  - Nếu đã full (tổng `pending + confirmed` ≥ capacity) → API trả 409 “Ca thi đã đầy”.
- **Admin duyệt**
  - Trung tâm vào `/admin/schedules`:
    - Khi duyệt nhiều đăng ký cùng lúc không thể vượt capacity (gặp 409 nếu vượt).
    - Khi confirm, `registeredCount` tăng đúng, notification gửi tới học viên.

### 4. AI Chat & Premium

- **Phân biệt lỗi**
  - Tài khoản free vào `/ai-chat`:
    - Lỗi hiển thị nội dung “chỉ dành cho Premium” kèm CTA “Nâng cấp Premium”.
  - Khi cấu hình sai Gemini model / hết quota:
    - UI hiển thị lỗi kỹ thuật thân thiện, **không** gợi ý nâng cấp Premium.
- **Cấu hình**
  - `backend/.env` có `GEMINI_API_KEY` và `GEMINI_MODEL` khớp với model đã test trên Google AI Studio.

### 5. Frontend UX & route

- **Nested interactive**
  - Console khi duyệt toàn bộ luồng chính (Home, Dashboard, Enroll, Upgrade, Profile, Admin) **không còn cảnh báo**:
    - “In HTML, `<a>` cannot be a descendant of `<a>`”.
- **Routing**
  - Truy cập `/home` → redirect về `/`.
  - Nhập URL lạ (vd. `/abcxyz`) → redirect về `/` (không trang trắng).
- **Empty states**
  - `/study-calendar`: nếu chưa gắn trung tâm → hiển thị giải thích + link về `/profile` hoặc `/application`.
  - `/center-register`: chỉ là CTA/mô tả, không còn form đăng ký trung tâm public.

### 6. Admin portal

- **Centers & users**
  - `system_admin`:
    - `/admin/centers` có thể tạo/sửa trung tâm với validation (tên ≥ 2 ký tự, city/address không quá dài).
    - `/admin/centers` + `/admin/users/center-admin` hoạt động với DTO validation (sai kiểu → 400).
- **Slots**
  - `/admin/schedules/slots`:
    - `center_admin` chỉ tạo/ sửa ca cho trung tâm của mình.
    - `system_admin` phải chọn `centerId` khi tạo ca thi; thiếu → 400 “System admin cần chọn centerId…”.

### 7. Docs & env

- **Docs khớp code**
  - `docs/domain-from-ui.md` mô tả đúng các endpoint `/api/*` và `/api/admin/*` đang dùng (không còn endpoint giả).
  - `docs/HUONG-DAN-CAI-DAT.md`:
    - Migration range `001`–`012`.
    - Hướng dẫn `reset:db`, `seed:db` đúng với schema hiện tại.
- **Env contract**
  - `backend/.env.example`:
    - Có `JWT_SECRET` (không gán default), `SEPAY_WEBHOOK_HMAC_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL` với ghi chú rõ.
  - `README.md`:
    - Nhắc không commit `.env` / secret.
    - Mô tả các file `.env.example` và biến bắt buộc.

### 8. Smoke test cuối theo role

- **Student**
  - Đăng ký → đăng nhập → Enroll (5k) → Học lý thuyết → Thi thử → Nộp hồ sơ → Được admin duyệt → Đăng ký ca thi.
- **Center admin**
  - Đăng nhập → xem danh sách học viên, hồ sơ, đăng ký ca → duyệt/reject một vài case.
- **System admin**
  - Tạo trung tâm mới → tạo center_admin mới → đăng nhập bằng center_admin đó → kiểm tra scope dữ liệu.

