# Figma → DriveGo route map

**File:** [Sigh-Up - Login](https://www.figma.com/design/yMP4KsLTC5kkLobbcBjTMa/Sigh-Up---Login?node-id=0-1)  
**fileKey:** `yMP4KsLTC5kkLobbcBjTMa`  
**Page:** `0:1` (Page 1)

## Canonical frames (duplicates resolved)

| Screen | Candidates | Chosen | Reason |
|--------|------------|--------|--------|
| Trang chủ | `43:901`, `49:2564` | **`49:2564`** | Same size; newer canvas position; includes Tra Cứu nav |
| Bảng giá | `46:1729`, `62:635` | **`62:635`** | Same V3 layout; newer node id |
| Học tập & thi thử | `46:1357` | split | Content → `/theory` + `/exam` |

## Route map

| Status | Route | Page | Figma frame | node-id | Layout |
|--------|-------|------|-------------|---------|--------|
| done | `/login` | LoginPage | Trang Đăng Nhập DriveGo | `43:1253` | auth |
| done | `/register` | RegisterPage | Trang Đăng Ký DriveGo | `43:1153` | auth |
| done | `/forgot-password` | ForgotPasswordPage | Quên Mật Khẩu | `60:9` | auth |
| done | `/home` | HomePage | Trang Chủ DriveGo Premium | `49:2564` | marketing |
| done | `/pricing` | PricingPage | Bảng Giá & Chọn Loại Bằng (V3) | `62:635` | marketing |
| done | `/docs` | DocsPage | Tài liệu | `59:976` | marketing |
| done | `/lookup` | LookupPage | Tra Cứu Thông Tin (V2) | `46:1585` | marketing |
| done | `/center-register` | CenterRegisterPage | Trung Tâm Đào Tạo (Đăng Ký) | `66:2` | marketing |
| done | `/student-dashboard` | StudentDashboardPage | Dashboard Học Viên | `48:1981` | dashboard |
| done | `/theory` | TheoryPage | Học Lý Thuyết + `46:1357` | `57:26` | dashboard |
| done | `/exam` | ExamPage | Trang Học Tập & Thi Thử (V1) | `46:1357` | dashboard |
| done | `/schedule` | SchedulePage | Lịch Thi | `57:326` | dashboard |
| done | `/history` | HistoryPage | Lịch sử làm bài | `62:48` | dashboard |
| done | `/study-calendar` | StudyCalendarPage | Lịch Học | `61:541` | dashboard |
| done | `/profile` | ProfilePage | Hồ Sơ Cá Nhân | `60:292` | dashboard |
| done | `/upgrade` | UpgradePage | Gia Hạn Gói | `60:80` | dashboard |
| done | `/notifications` | NotificationsPage | Thông báo | `61:1117` | dashboard |
| done | `/ai-chat` | AiChatPage | AI Chat | `61:962` | dashboard |
| done | `/admin-dashboard` | AdminDashboardPage | Dashboard Trung Tâm | `48:2275` | admin |

**Shell (no separate frame):** `MarketingNav`, `SiteFooter` ← Home `49:2564`; `SidebarNav`, `DashboardLayout` ← `48:1981`.

## Design tokens (from MCP login `43:1253`)

| Token | Value |
|-------|--------|
| canvas | `#0b0f1a` |
| accent | `#3c3cf6` |
| surface | `rgba(21,26,45,0.95)` |
| elevated / input | `#1e243a` |
| border | `#2a324e` |
| text primary | `#ffffff` / `#e2e8f0` |
| text muted | `#94a3b8` |
| text placeholder | `#64748b` |
| radius card | `16px` |
| radius input/button | `24px` |

## Responsive note

Figma frames are **desktop 1280px**. App uses `max-w-7xl` + responsive grids; no dedicated mobile frames in file.

## MCP workflow

1. `get_design_context` with `fileKey` + `nodeId`
2. Adapt to `UiCard`, `TextField`, `PrimaryButton`, layouts
3. Copy → `src/content/vi.js`
4. Assets → `public/images/<screen>/`
