# Domain from UI (current state)

Tai lieu nay map nhanh UI hien tai sang API backend dang hoat dong. Dung de tranh nham endpoint cu.

## Vai tro & route chinh

| Role | Route UI |
|------|----------|
| `student` | `/student-dashboard`, `/theory`, `/exam`, `/history`, `/schedule`, `/study-calendar`, `/application`, `/ai-chat` |
| `center_admin` | `/admin-dashboard`, `/admin/students`, `/admin/applications`, `/admin/schedules`, `/admin/schedules/slots`, `/admin/class-sessions`, `/admin/courses` |
| `system_admin` | Tat ca route admin + `/admin/centers` |

## API map dung theo implementation

### Auth / user

- `POST /api/auth/register` (public): tao tai khoan `student`.
- `POST /api/auth/login`
- `POST /api/auth/google-login`
- `POST /api/auth/forgot-password` (placeholder)
- `GET /api/users/me`
- `PATCH /api/users/me`

### Hoc tap / thi thu

- `GET /api/license-classes`
- `GET /api/study/chapters?licenseClass=...`
- `POST /api/study/chapters/:id/complete`
- `GET /api/study/dashboard-summary`
- `GET /api/exams/papers?licenseClass=...`
- `GET /api/exams/:paperId`
- `POST /api/exams/:paperId/attempts`
- `GET /api/exams/attempts/history`

### Lich thi / dang ky ca thi

- `GET /api/schedules?licenseClass=&date=&slotType=`
- `GET /api/schedules/registrations/me`
- `POST /api/schedules/registrations`

Dang ky ca thi yeu cau ho so da `approved` (khong chi submitted).

### Ho so sat hach

- `GET /api/applications/me`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `POST /api/applications/:id/documents`
- `POST /api/applications/:id/submit`

### Noi dung / tra cuu / thong bao

- `GET /api/articles?search=&licenseClass=`
- `GET /api/articles/:slug`
- `GET /api/lookup?code=`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

### AI Chat

- `GET /api/chat/sessions`
- `POST /api/chat/sessions`
- `GET /api/chat/sessions/:id`
- `POST /api/chat/sessions/:id/messages`

Yeu cau Premium. Neu co `GEMINI_API_KEY` thi goi Gemini, neu khong thi dung reply demo.

### Admin APIs

- `GET/PATCH /api/admin/registrations`
- `GET/POST /api/admin/slots`
- `GET/POST/PATCH/DELETE /api/admin/schedule-slots`
- `GET/PATCH /api/admin/students`, `GET /api/admin/students/:userId`
- `GET/PATCH /api/admin/applications`, `POST /api/admin/applications/:id/request-dossier`
- `GET /api/admin/dashboard/summary`
- `GET /api/admin/enrollments`
- `GET /api/admin/payments`
- `GET/PATCH /api/admin/chapters/*`
- `GET/PATCH /api/admin/license-classes/*`
- `GET/POST/PATCH/DELETE /api/admin/class-sessions`
- `GET/POST/PATCH /api/admin/centers` (system admin)
- `POST /api/admin/users/center-admin` (system admin)

## Ghi chu drift

- Route cu kieu `/api/me`, `/api/dashboard`, `/api/attempts`, `/api/registrations` da khong con dung.
- `POST /api/centers/register` da bo; center tao qua `/api/admin/centers`.
