# DriveGo — Tóm tắt dự án (đọc trước khi sửa code)

> File này gom luồng nghiệp vụ, API, DB và đường dẫn code chính. Dùng khi tiếp tục dev để không phải đọc lại toàn repo.

**Repo:** https://github.com/Raintostorm/DriveGo.git  
**Monorepo:** `frontend/` (React+Vite), `backend/` (NestJS), `database/` (PG scripts)

---

## 1. Luồng học viên (đã chốt)

```
Đăng ký khóa (SePay ~5.000đ) ──► Học lý thuyết + thi thử (KHÔNG cần hồ sơ)
Premium (tùy chọn) ───────────► song song
HV tự nộp hồ sơ (draft → submitted) ──► Admin duyệt → approved
Nộp lại (khi cần): admin POST request-dossier ──► HV sửa & submit lại
        └────────────────────────► Đăng ký ca thi (cần hồ sơ approved)
```

`GET /applications/me` ưu tiên hồ sơ **draft** nếu đang soạn; admin list gồm trạng thái `draft`.

| Việc | Điều kiện |
|------|-----------|
| Checkout Premium / enrollment | Chỉ `role = student` |
| Học / xem chương / tiến độ | `course_enrollments.status = active` hạng đó |
| List/get đề, nộp thi thử | Enrolled + `assertCanSubmitExam` (Premium / 10 bài free) |
| Đăng ký ca thi | Hồ sơ `license_applications.status = approved` |
| Admin | Không mua Premium; xem HV Premium + enrolled |

Phí khóa test: **5.000đ** mọi hạng (`license_classes.enrollment_fee`). Sau này map giá thật theo hạng.

---

## 2. Database — migration quan trọng

| File | Nội dung |
|------|----------|
| `006_admin_workflow.sql` | `slot_type`, review hồ sơ, `users.center_id` |
| `007_enrollment_and_dossier_request.sql` | `course_enrollments`, `payments.payment_type`, `dossier_*` |

**Bảng mới / cột chính**

- `course_enrollments`: `user_id`, `license_class`, `status` (pending/active/cancelled), `payment_id`, UNIQUE `(user_id, license_class)`
- `payments`: `payment_type` (`premium` \| `enrollment`), `license_class`
- `license_applications`: `dossier_requested_at`, `dossier_deadline`
- `license_classes`: `enrollment_fee` (default 5000)

**Entity:** `backend/src/entities/course-enrollment.entity.ts`

**Lệnh migrate (theo thứ tự nếu DB mới):**

```bash
npm run migrate:admin
npm run migrate:enrollment
npm run migrate:admin-ops
npm run migrate:content-admin
npm run migrate:class-sessions
```

---

## 3. Backend — module & gate

### Enrollment (global)

- `backend/src/common/enrollment.service.ts` — `isEnrolled`, `assertEnrolled`, `activateFromPayment`, `listForUser`
- `backend/src/common/enrollment.module.ts` — `@Global()`
- `GET /api/enrollments/me` — `modules/enrollments/enrollments.controller.ts`

### Payments (SePay)

- `POST /api/payments/checkout` body: `{ paymentType, planCode?, licenseClass?, fullName?, email? }`
  - `premium` → cần `planCode` (mặc định `premium`)
  - `enrollment` → bắt buộc `licenseClass` (A1/A2/B1/B2)
- Webhook `markPaid`: `enrollment` → upsert `course_enrollments` active; `premium` → `student_profiles.premium_until` (+30 ngày)
- File: `modules/payments/payments.service.ts`, `dto/checkout.dto.ts`

### Gate theo tính năng

| Service | Gate |
|---------|------|
| `study.service.ts` | `assertEnrolled` khi có `userId` |
| `exams.service.ts` | `assertEnrolled` (đã **bỏ** `assertSubmittedForExam` ở `submitAttempt`) |
| `schedules.service.ts` | `assertApprovedForExam` (không còn chỉ submitted) |
| `applications.service.ts` | Sửa/upload khi `draft` **hoặc** `dossier_requested_at`; `requestDossier()` |

### Admin (`/api/admin/*`, `RolesGuard`: center_admin, system_admin)

| Endpoint | File |
|----------|------|
| `GET /admin/applications` | `admin-applications.*` |
| `PATCH /admin/applications/:id` | duyệt hồ sơ + notify |
| `POST /admin/applications/:id/request-dossier` | `{ deadline?: ISO }` + notify HV |
| `GET /admin/students?premium=&enrolled=&licenseClass=` | `admin-students.*` |
| `GET/PATCH /admin/registrations` | `admin-schedules.*` |
| `GET /admin/dashboard/summary` | `admin-dashboard.*` (+ buổi học, điểm danh) |
| `GET /admin/students/:userId`, `PATCH .../note` | `admin-students.*` (scope center) |
| `GET /admin/enrollments`, `GET /admin/payments` | read-only, scope center |
| `GET/POST/PATCH/DELETE /admin/schedule-slots` | `admin-slots.*` |
| `GET/PATCH /admin/chapters/*`, `PATCH /admin/license-classes/:code` | `admin-content.*` |
| `GET/POST/PATCH/DELETE /admin/class-sessions` | `admin-class-sessions.*` |
| `POST /admin/class-sessions/:id/attendance` | check-in HV (admin) |
| `GET/POST/PATCH /admin/centers` | `admin-centers.*` (system_admin) |
| `POST /admin/users/center-admin` | `admin-users.*` (system_admin) |
| `GET /sessions/upcoming`, `POST /sessions/:id/check-in` | `sessions.*` (HV) |
| `GET /study/dashboard-summary` | `study.service.ts` |

Scope trung tâm: `admin-scope.service.ts` (center_admin chỉ thấy `center_id` của mình).

**Đăng nhập admin:** staff → `/admin-dashboard`; không vào route HV (`AuthGate` redirect). Demo: `center@drivego.demo`, `admin@drivego.demo` / `DriveGo123!` sau `npm run seed:db` hoặc `npm run reset:db`.

### Catalog / plans

- `GET /api/license-classes` — `license-classes.service.ts` (+ `enrollmentFee`, `contentReady`)
- `GET /api/plans` — `plans.service.ts` (+ `enrollmentFee` trên license classes)

### Hằng số hạng

- `backend/src/common/license-class.constants.ts` — `STUDY_LICENSE_CODES`, `DEFAULT_LICENSE_CLASS` (B2)

---

## 4. Frontend — route & context

| Route | Trang | Ghi chú |
|-------|-------|---------|
| `/enroll?class=B2` | `EnrollPage.jsx` | Checkout `paymentType: enrollment` |
| `/upgrade` | `UpgradePage.jsx` | `paymentType: premium` |
| `/theory`, `/exam` | CTA `EnrollCourseCta` nếu chưa enrolled |
| `/application` | HV nộp chủ động khi `draft`; read-only khi đã nộp; sửa lại khi `dossierRequestedAt` |
| `/schedule` | Lỗi API nhắc hồ sơ **đã duyệt** |
| `/admin/students`, `/admin/students/:userId` | Danh sách + chi tiết HV |
| `/admin/applications`, `/admin/schedules` | Hồ sơ + đăng ký ca |
| `/admin/schedules/slots` | CRUD ca thi |
| `/admin/courses`, `/admin/courses/:code/chapters` | CMS chương / học phí |
| `/admin/class-sessions` | Buổi học + điểm danh |
| `/admin/centers` | system_admin — trung tâm & tạo center_admin |
| `/study-calendar` | API `sessions/upcoming` + check-in |

**Context:** `LicenseProvider` chỉ bọc `StudentLayout` (`frontend/src/components/layouts/StudentLayout.jsx`).

**Admin API helper:** `frontend/src/lib/admin-api.js`

**Layout:** `StudentLayout` / `AdminLayout` — admin **không** Premium/Upgrade/nav HV.

**Component tái dùng:** `EnrollCourseCta.jsx`, `LicenseClassSwitcher.jsx`, `LicenseContentEmpty.jsx`

---

## 5. Nội dung A1–B2 (600 câu → 20 đề / hạng)

| Hạng | Video (chapters) | Đề thi |
|------|------------------|--------|
| A1, A2, B1, B2 | 4 chương YouTube / hạng | 20 đề × ~30 câu (ngân hàng **chung** từ B2, MVP) |

- Parse PDF: `database/scripts/parse-b2-pdf.py` → `database/content/B2/papers.json`
- Bootstrap A1/A2/B1: `database/scripts/bootstrap-license-content.mjs`
- Import DB: `npm run import:content:all`
- **599 câu** — PDF thiếu câu 507 (506→508); ảnh `/content/B2/images/`

```bash
pip install -r database/scripts/requirements-pdf.txt
npm run parse:b2-pdf
npm run seed:db
npm run reset:db   # truncate + migrate + seed + import:content:all (DB local)
npm run import:content:all
```

Seed **không** còn 2 đề demo — chỉ dùng import.

---

## 6. Demo & env

| Email | Role | Mật khẩu |
|-------|------|----------|
| `student@drivego.demo` | student | `DriveGo123!` |
| `center@drivego.demo` | center_admin | `DriveGo123!` |
| `admin@drivego.demo` | system_admin | `DriveGo123!` |

- Demo student **không** auto-enroll (test flow 5k).
- SePay: `backend/.env` — `SEPAY_BANK_ACCOUNT`, prefix mã CK, v.v.
- `DATABASE_URL` trong `backend/.env`

```bash
npm run dev          # FE + BE
npm run reset:db   # DB sạch: truncate + migrate + seed + import
```

---

## 7. Lệnh npm hay dùng

```bash
npm run migrate:admin
npm run migrate:enrollment
npm run migrate:admin-ops
npm run migrate:content-admin
npm run migrate:class-sessions
npm run seed:db
npm run reset:db   # truncate + migrate + seed + import:content:all (DB local)
npm run parse:b2-pdf
npm run bootstrap:content
npm run import:content:all
npm run extend-premium   # gia hạn demo premium
```

---

## 8. Không commit / Phase 2

- `.env`, `firebase-adminsdk*.json`, `backend/uploads/`
- PDF 600 câu ở root repo
- Script debug `database/scripts/_probe_*.py`

**Phase 2 (chưa làm):** AI Premium mở rộng; giá enrollment theo từng hạng thật; role `center_staff`.

---

## 9. Map file nhanh khi sửa bug

| Muốn sửa | Mở file |
|----------|---------|
| Gate học/thi | `enrollment.service.ts`, `study.service.ts`, `exams.service.ts` |
| Gate ca thi | `schedules.service.ts`, `applications.service.ts` (`assertApprovedForExam`) |
| Thanh toán / webhook | `payments.service.ts` |
| Hồ sơ HV | `applications.service.ts`, `ApplicationPage.jsx` |
| Admin duyệt / yêu cầu hồ sơ | `admin-applications.service.ts`, `AdminApplicationDetailPage.jsx` |
| Danh sách HV admin | `admin-students.service.ts`, `AdminStudentsPage.jsx` |
| UI đăng ký khóa | `EnrollPage.jsx`, `PricingPage.jsx` |
| Thêm migration | `database/migrations/00X_*.sql` + entity + `database.module.ts` + script root `package.json` |

---

## 10. QA hồ sơ sát hạch

1. `student@drivego.demo` → `/application`: form mở, Lưu nháp + Nộp hồ sơ (trạng thái nháp).
2. Nộp đủ giấy tờ → admin thấy hồ sơ (filter Đã nộp hoặc Tất cả).
3. Admin duyệt `approved` → HV đăng ký ca `/schedule`.
4. Admin **Yêu cầu nộp lại** (không trên hồ sơ nháp) → HV banner vàng, sửa + Nộp lại.
5. HV đã nộp, chưa request → read-only + copy chờ trung tâm.

*Cập nhật lần cuối: luồng hồ sơ proactive + admin list draft; portal admin migrations 009–011.*
