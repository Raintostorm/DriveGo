# Nạp nội dung theo hạng GPLX

Thư mục này dùng với script `import-license-content.mjs`. Mỗi hạng một folder:

```
database/content/
  A1/
    chapters.json
    papers.json
    articles.json   (tùy chọn)
  A2/
  B1/
  B2/
```

## `chapters.json`

```json
{
  "chapters": [
    {
      "id": "optional-uuid",
      "title": "Chương 1: ...",
      "sortOrder": 1,
      "durationMinutes": 45,
      "videoUrl": "https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0",
      "description": "Mô tả ngắn"
    }
  ]
}
```

## `papers.json`

```json
{
  "papers": [
    {
      "id": "optional-uuid",
      "paperNumber": 1,
      "questionCount": 10,
      "isMock": true,
      "questions": [
        {
          "body": "Câu hỏi?",
          "answers": ["A", "B", "C", "D"],
          "correctIndex": 0,
          "isCritical": false,
          "imageUrl": null
        }
      ]
    }
  ]
}
```

## `articles.json` (tùy chọn)

```json
{
  "articles": [
    {
      "slug": "huong-dan-a1",
      "title": "...",
      "body": "...",
      "category": "ly-thuyet",
      "licenseClass": "A1"
    }
  ]
}
```

`licenseClass: null` hoặc bỏ field = tài liệu chung (hiện với mọi hạng).

## Parse PDF 600 câu (B2)

Đặt file PDF chính thức ở thư mục gốc project, cài PyMuPDF rồi chạy:

```bash
pip install -r database/scripts/requirements-pdf.txt
npm run parse:b2-pdf
```

Script tạo `database/content/B2/papers.json`, ảnh trong `images/` và copy sang `frontend/public/content/B2/images/` (URL `/content/B2/images/cau-XXX.png`).

**Lưu ý:** bản PDF CSGT 2025 hiện thiếu **Câu 507** (nhảy từ 506 → 508); log nằm ở `database/content/B2/parse-log.txt`.

## Admin portal (hồ sơ & lịch)

```bash
npm run migrate:admin
```

Đăng nhập: `center@drivego.demo` hoặc `admin@drivego.demo` · mật khẩu `DriveGo123!`

- `/admin-dashboard` — tổng quan
- `/admin/applications` — tải & duyệt hồ sơ
- `/admin/schedules` — xác nhận ca lý thuyết / chạy thử

## Chạy import

```bash
npm run import:content -- A1 database/content/A1
npm run import:content -- B2 database/content/B2
```

Script **upsert** theo `id` / `slug` / `(application_id, doc_type, slot)` — không xóa nội dung hạng khác.
