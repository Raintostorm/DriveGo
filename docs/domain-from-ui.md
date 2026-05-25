# Domain spec suy ra tu UI DriveGo (phase FE)

Tai lieu nay duoc rut ra tu cac man hinh React hien tai. Cap nhat theo API/DB hien co.

### Hạng GPLX (học / thi)

- Catalog: `GET /api/license-classes` — `contentStatus`: `ready` | `coming_soon` (derive từ chapters + exam papers).
- Học viên chọn hạng đang học: `student_profiles.license_class` (đăng ký + sidebar switcher → `PATCH /users/me`).
- Nội dung theo hạng: `study/chapters?licenseClass=`, `exams/papers?licenseClass=`, `articles?licenseClass=` (NULL = tài liệu chung).
- Phase 1 nội dung đầy đủ: **B2**; A1/A2/B1: catalog + empty state. Nạp thêm: `npm run import:content -- <CODE> database/content/<CODE>` (xem `database/content/README.md`).

## Vai tro nguoi dung

| Role | Man hinh lien quan |
|------|-------------------|
| Khach / Hoc vien | Home, Register, Login, Theory, Exam, History, Profile, Schedule, Upgrade |
| Trung tam dao tao | CenterRegister, AdminDashboard |
| He thong | Notifications, AI Chat, Lookup (cong khai) |

## Entities (nhap)

### User & auth
- **User**: id, email, passwordHash, role (`student` | `center_admin` | `system_admin`), createdAt
- **StudentProfile**: userId, fullName, phone, licenseClass (B2...), centerId?, premiumUntil?
- **TrainingCenter**: name, taxCode, city, address, capacityTier, licenseClasses[]
- **PasswordResetToken**: userId, token, expiresAt

### Hoc tap & thi
- **LicenseClass**: code (A1, B2...), price, description
- **StudyChapter**: title, order, durationMinutes, licenseClassId
- **StudyProgress**: userId, chapterId, completedLessons, percent
- **ExamPaper**: number, licenseClass, questionCount, isMock
- **Question**: paperId?, text, imageUrl, answers[], correctIndex, isCritical (diem liet)
- **ExamAttempt**: userId, paperId, startedAt, finishedAt, score, passed, answers[]

### Lich & dang ky thi
- **ScheduleSlot**: date, startTime, endTime, venue, licenseClass, capacity, registeredCount
- **ExamRegistration**: userId, slotId, status (`pending` | `confirmed` | `cancelled` | `completed`)

### Noi dung & ho tro
- **DocumentArticle**: slug, title, body, category, licenseClass? (null = chung), updatedAt, pdfUrl?
- **Notification**: userId, type, title, body, readAt?, actionUrl?
- **ChatSession** / **ChatMessage**: userId, title, messages[], role user/assistant
- **LookupRecord**: nationalIdOrCode, studentName, licenseClass, resultStatus (tra cuu cong khai)

### Thuong mai
- **SubscriptionPlan**: code (`free` | `premium`), priceMonthly, features[]
- **Payment**: userId, planId, amount, method, status, customerInfo

### Ho so sat hanh (applications)
- **LicenseApplication**: userId, licenseClass, centerId?, status (`draft` | `submitted` | `reviewing` | `approved` | `rejected`), personalInfo (JSON), submittedAt
- **ApplicationDocument**: applicationId, docType, slotIndex, filePath, originalName, mimeType
- Doc types bat buoc: `photo_3x4_blue` x4 slot, `photo_4x6_white`, `cccd_front`, `cccd_back`, `vneid_l2`; tuy chon: `gplx_optional`

## API sketch (REST)

### Auth
- `POST /api/auth/register` — body: role, email, password, fullName, phone?, licenseClass? (A1|A2|B1|B2, default B2)
- `GET /api/license-classes` — catalog hạng + contentStatus
- `POST /api/auth/login` — email, password → JWT + user
- `POST /api/auth/forgot-password` — email
- `POST /api/auth/reset-password` — token, newPassword

### Hoc vien
- `GET /api/me` — profile + subscription
- `GET /api/dashboard` — stats, currentChapter, reviewTips
- `GET /api/chapters` — roadmap
- `GET /api/exams/:paperId` — questions (thi thu)
- `POST /api/exams/:paperId/attempts` — submit answers → score
- `GET /api/attempts` — lich su (History page)
- `GET /api/schedules?month=&city=&class=` — calendar + slots
- `POST /api/registrations` — dang ky ca thi
- `GET /api/notifications` — list + filter
- `PATCH /api/notifications/:id/read`
- `POST /api/chat/sessions` / `POST /api/chat/sessions/:id/messages`
- `GET /api/lookup?code=` — tra cuu (co the rate-limit)

### Trung tam
- `POST /api/centers/register` — CenterRegister form
- `GET /api/admin/dashboard` — KPI, charts
- `GET /api/admin/students` — quan ly hoc vien

### Tai lieu & gia
- `GET /api/articles?search=` — Docs
- `GET /api/plans` — Pricing
- `POST /api/payments/checkout` — Upgrade page
- `GET /api/applications/me` — ho so nop sat hanh (draft/submitted)
- `POST /api/applications` — tao draft
- `PATCH /api/applications/:id` — personalInfo, licenseClass
- `POST /api/applications/:id/documents` — multipart upload (local `backend/uploads/`)
- `POST /api/applications/:id/submit` — validate du giay to → submitted

## DB tables (sketch quan he)

```
users (id, email, password_hash, role, ...)
student_profiles (user_id FK, full_name, phone, license_class, ...)
training_centers (id, name, tax_code, ...)
exam_papers (id, license_class, number, ...)
questions (id, paper_id, text, ...)
exam_attempts (id, user_id, paper_id, score, passed, ...)
schedule_slots (id, center_id, date, start_time, capacity, ...)
exam_registrations (id, user_id, slot_id, status, ...)
notifications (id, user_id, type, title, body, read_at, ...)
subscription_plans (id, code, price_monthly, ...)
payments (id, user_id, plan_id, amount, status, ...)
license_applications (id, user_id, license_class, status, personal_info, submitted_at, ...)
application_documents (id, application_id, doc_type, slot_index, file_path, ...)
document_articles (id, slug, title, body, ...)
chat_sessions (id, user_id, title, ...)
chat_messages (id, session_id, role, content, ...)
```

## Map UI → API (nhanh)

| Route | Hanh vi UI (mock) | API sau nay |
|-------|-------------------|-------------|
| `/login` | Form submit | POST login |
| `/register` | Tao tai khoan | POST register |
| `/exam` | Chon dap an, timer | GET paper + POST attempt |
| `/history` | Bang ket qua | GET attempts |
| `/schedule` | Chon ngay + Dang ky | GET schedules + POST registration |
| `/upgrade` | Chon goi + thanh toan | GET plans + POST payment |
| `/application` | Form + upload giay to | applications API |
| `/profile` | Sua ho so + lich su thi | PATCH /users/me, GET attempts/history |
| `/ai-chat` | Gui tin nhan | POST chat message (stream) |
| `/lookup` | Tra cuu CCCD | GET lookup |
| `/admin-dashboard` | Chart/KPI | GET admin dashboard |

## Ghi chu phase sau

- Khong implement file nay trong Vite app; tao repo backend rieng hoac folder `server/` khi san sang.
- Uu tien auth + exam attempts + schedule registration theo flow hoc vien.
