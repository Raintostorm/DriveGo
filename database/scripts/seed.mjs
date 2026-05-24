import bcrypt from "bcryptjs"
import pg from "pg"
import {
  ARTICLE_SLUGS,
  DEMO_ARTICLES,
  DEMO_NOTIFICATIONS,
  LOOKUP_CODES,
  buildPaper1Questions,
  buildPaper2Questions,
} from "./seed-content.mjs"

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:12345@localhost:5432/DriveGo"

const DEMO_PASSWORD = "DriveGo123!"
const DEMO_EMAILS = [
  "student@drivego.demo",
  "center@drivego.demo",
  "admin@drivego.demo",
]

const ID = {
  center: "11111111-1111-4111-8111-111111111101",
  userStudent: "22222222-2222-4222-8222-222222222201",
  userCenter: "22222222-2222-4222-8222-222222222202",
  userAdmin: "22222222-2222-4222-8222-222222222203",
  licenseB2: "33333333-3333-4333-8333-333333333301",
  licenseA1: "33333333-3333-4333-8333-333333333302",
  chapter1: "44444444-4444-4444-8444-444444444401",
  chapter2: "44444444-4444-4444-8444-444444444402",
  chapter3: "44444444-4444-4444-8444-444444444403",
  chapter4: "44444444-4444-4444-8444-444444444404",
  paper1: "55555555-5555-4555-8555-555555555501",
  paper2: "55555555-5555-4555-8555-555555555502",
  question1: "66666666-6666-4666-8666-666666666601",
  question2: "66666666-6666-4666-8666-666666666602",
  question3: "66666666-6666-4666-8666-666666666603",
  question4: "66666666-6666-4666-8666-666666666604",
  question5: "66666666-6666-4666-8666-666666666605",
  question6: "66666666-6666-4666-8666-666666666606",
  question7: "66666666-6666-4666-8666-666666666607",
  question8: "66666666-6666-4666-8666-666666666608",
  question9: "66666666-6666-4666-8666-666666666609",
  question10: "66666666-6666-4666-8666-666666666610",
  slot1: "77777777-7777-4777-8777-777777777701",
  slot2: "77777777-7777-4777-8777-777777777702",
  slot3: "77777777-7777-4777-8777-777777777703",
  slot4: "77777777-7777-4777-8777-777777777704",
  slot5: "77777777-7777-4777-8777-777777777705",
  planFree: "88888888-8888-4888-8888-888888888801",
  planPremium: "88888888-8888-4888-8888-888888888802",
  article1: "99999999-9999-4999-8999-999999999901",
  article2: "99999999-9999-4999-8999-999999999902",
  article3: "99999999-9999-4999-8999-999999999903",
  article4: "99999999-9999-4999-8999-999999999904",
  article5: "99999999-9999-4999-8999-999999999905",
  article6: "99999999-9999-4999-8999-999999999906",
  chatSession1: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01",
  chatSession2: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02",
  chatSession3: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa03",
}

const PAPER_IDS = [ID.paper1, ID.paper2]
const CHAPTER_IDS = [ID.chapter1, ID.chapter2, ID.chapter3, ID.chapter4]
const SLOT_IDS = [ID.slot1, ID.slot2, ID.slot3, ID.slot4, ID.slot5]
const ARTICLE_IDS = [ID.article1, ID.article2, ID.article3, ID.article4, ID.article5, ID.article6]
const LOOKUP_CODE_LIST = LOOKUP_CODES.map((r) => r.code)

const client = new pg.Client({ connectionString: DATABASE_URL })

async function clearDemoData() {
  await client.query(`DELETE FROM users WHERE email = ANY($1::text[])`, [DEMO_EMAILS])
  await client.query(`DELETE FROM lookup_records WHERE national_id_or_code = ANY($1::text[])`, [
    LOOKUP_CODE_LIST,
  ])
  await client.query(`DELETE FROM questions WHERE paper_id = ANY($1::uuid[])`, [PAPER_IDS])
  await client.query(`DELETE FROM exam_papers WHERE id = ANY($1::uuid[])`, [PAPER_IDS])
  await client.query(`DELETE FROM schedule_slots WHERE id = ANY($1::uuid[])`, [SLOT_IDS])
  await client.query(`DELETE FROM document_articles WHERE slug = ANY($1::text[])`, [ARTICLE_SLUGS])
  await client.query(`DELETE FROM study_chapters WHERE id = ANY($1::uuid[])`, [CHAPTER_IDS])
  await client.query(`DELETE FROM license_classes WHERE code IN ('A1', 'A2', 'B1', 'B2')`)
}

async function insertQuestions(paperId, questions) {
  for (const q of questions) {
    await client.query(
      `INSERT INTO questions (id, paper_id, body, answers, correct_index, is_critical) VALUES
       ($1, $2, $3, $4::jsonb, $5, $6)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, answers = EXCLUDED.answers`,
      [q.id, paperId, q.body, JSON.stringify(q.answers), q.correctIndex, q.isCritical],
    )
  }
}

async function seed() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
  const paper1Questions = buildPaper1Questions(ID)
  const paper2Questions = buildPaper2Questions(ID)

  await client.query(
    `INSERT INTO training_centers (id, name, tax_code, city, address)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
    [ID.center, "Trung tâm Lái xe DriveGo Củ Chi", "0312345678", "TP. Hồ Chí Minh", "123 Đường Lái Xe, Củ Chi"],
  )

  await client.query(
    `INSERT INTO users (id, email, password_hash, role) VALUES
     ($1, $2, $3, 'student'),
     ($4, $5, $3, 'center_admin'),
     ($6, $7, $3, 'system_admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
    [ID.userStudent, DEMO_EMAILS[0], passwordHash, ID.userCenter, DEMO_EMAILS[1], ID.userAdmin, DEMO_EMAILS[2]],
  )

  await client.query(
    `INSERT INTO student_profiles (user_id, full_name, phone, license_class, center_id, premium_until)
     VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '30 days')
     ON CONFLICT (user_id) DO UPDATE SET
       full_name = EXCLUDED.full_name,
       phone = EXCLUDED.phone,
       license_class = EXCLUDED.license_class`,
    [ID.userStudent, "Nguyễn Văn An", "0912345678", "B2", ID.center],
  )

  await client.query(
    `INSERT INTO license_classes (id, code, price, description) VALUES
     ($1, 'A1', 799000, 'Bằng A1 — xe máy'),
     ($2, 'A2', 1500000, 'Bằng A2'),
     (gen_random_uuid(), 'B1', 12000000, 'Bằng B1'),
     (gen_random_uuid(), 'B2', 15000000, 'Bằng B2 — phổ biến nhất')
     ON CONFLICT (code) DO UPDATE SET price = EXCLUDED.price, description = EXCLUDED.description`,
    [ID.licenseA1, ID.licenseB2],
  )

  const b2Row = await client.query(`SELECT id FROM license_classes WHERE code = 'B2' LIMIT 1`)
  const b2Id = b2Row.rows[0]?.id || ID.licenseB2

  await client.query(`
    ALTER TABLE study_chapters ADD COLUMN IF NOT EXISTS video_url TEXT;
    ALTER TABLE study_chapters ADD COLUMN IF NOT EXISTS description TEXT;
  `)

  await client.query(
    `INSERT INTO study_chapters (id, license_class_id, title, sort_order, duration_minutes, video_url, description) VALUES
     ($1, $5, 'Chương 1: Biển báo hiệu đường bộ', 1, 45,
      'https://www.youtube-nocookie.com/embed/uxUPB3650Dg?rel=0&modestbranding=1', 'Nhận biết biển báo cấm, nguy hiểm và hiệu lệnh.'),
     ($2, $5, 'Chương 2: Quy tắc giao thông', 2, 50,
      'https://www.youtube-nocookie.com/embed/LlSwGVdgP80?rel=0&modestbranding=1', 'Quy tắc ưu tiên, làn đường và khoảng cách an toàn.'),
     ($3, $5, 'Chương 3: Kỹ thuật lái xe an toàn', 3, 40,
      'https://www.youtube-nocookie.com/embed/gmqXczpogrA?rel=0&modestbranding=1', 'Lái ban đêm, đường mưa và cao tốc.'),
     ($4, $5, 'Chương 4: Giải đề thi thử', 4, 35,
      'https://www.youtube-nocookie.com/embed/YN-hDPsGpsg?rel=0&modestbranding=1', 'Mẹo giải câu điểm liệt và tình huống mỹ phẩm.')
     ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url`,
    [ID.chapter1, ID.chapter2, ID.chapter3, ID.chapter4, b2Id],
  )

  await client.query(
    `INSERT INTO study_progress (user_id, chapter_id, completed_lessons, percent) VALUES
     ($1, $2, 12, 45), ($1, $3, 5, 20), ($1, $4, 0, 0), ($1, $5, 0, 0)
     ON CONFLICT (user_id, chapter_id) DO UPDATE SET percent = EXCLUDED.percent`,
    [ID.userStudent, ID.chapter1, ID.chapter2, ID.chapter3, ID.chapter4],
  )

  await client.query(
    `INSERT INTO exam_papers (id, license_class, paper_number, question_count, is_mock) VALUES
     ($1, 'B2', 8, $3, true), ($2, 'B2', 7, $4, true)
     ON CONFLICT (id) DO UPDATE SET question_count = EXCLUDED.question_count`,
    [ID.paper1, ID.paper2, paper1Questions.length, paper2Questions.length],
  )

  await insertQuestions(ID.paper1, paper1Questions)
  await insertQuestions(ID.paper2, paper2Questions)

  await client.query(
    `INSERT INTO exam_attempts (user_id, paper_id, started_at, finished_at, score, passed, answers) VALUES
     ($1, $2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '12 minutes', 9, true, '{"correct":9,"wrong":1}'::jsonb),
     ($1, $2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '18 minutes', 10, true, '{"correct":10,"wrong":0}'::jsonb),
     ($1, $3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '22 minutes', 6, false, '{"correct":6,"wrong":4}'::jsonb),
     ($1, $3, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days' + INTERVAL '15 minutes', 8, true, '{"correct":8,"wrong":2}'::jsonb),
     ($1, $2, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days' + INTERVAL '20 minutes', 7, false, '{"correct":7,"wrong":3}'::jsonb)`,
    [ID.userStudent, ID.paper1, ID.paper2],
  )

  await client.query(
    `INSERT INTO schedule_slots (id, center_id, slot_date, start_time, end_time, venue, license_class, capacity, registered_count) VALUES
     ($1, $6, CURRENT_DATE + 7, '08:00', '11:30', 'Sân sát hạch Củ Chi', 'B2', 40, 12),
     ($2, $6, CURRENT_DATE + 7, '13:30', '17:00', 'Sân sát hạch Củ Chi', 'B2', 40, 28),
     ($3, $6, CURRENT_DATE + 14, '08:00', '11:30', 'Sân sát hạch Củ Chi', 'B2', 40, 5),
     ($4, $6, CURRENT_DATE + 14, '13:30', '17:00', 'Sân sát hạch Củ Chi', 'B2', 40, 35),
     ($5, $6, CURRENT_DATE + 21, '08:00', '11:30', 'Sân sát hạch Củ Chi', 'B1', 30, 30)
     ON CONFLICT (id) DO UPDATE SET registered_count = EXCLUDED.registered_count`,
    [ID.slot1, ID.slot2, ID.slot3, ID.slot4, ID.slot5, ID.center],
  )

  await client.query(
    `INSERT INTO exam_registrations (user_id, slot_id, status) VALUES ($1, $2, 'confirmed')`,
    [ID.userStudent, ID.slot1],
  )

  await client.query(
    `INSERT INTO subscription_plans (id, code, price_monthly, features) VALUES
     ($1, 'free', 0, '["10 đề thi cơ bản","Lưu kết quả gần nhất"]'::jsonb),
     ($2, 'premium', 5000, '["Thi không giới hạn","AI Chat","Hỗ trợ 24/7","Video lý thuyết"]'::jsonb)
     ON CONFLICT (code) DO UPDATE SET price_monthly = EXCLUDED.price_monthly`,
    [ID.planFree, ID.planPremium],
  )

  for (let i = 0; i < DEMO_ARTICLES.length; i++) {
    const a = DEMO_ARTICLES[i]
    await client.query(
      `INSERT INTO document_articles (id, slug, title, body, category, updated_at) VALUES
       ($1, $2, $3, $4, $5, NOW() - ($6 || ' days')::interval)
       ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body`,
      [ARTICLE_IDS[i], a.slug, a.title, a.body, a.category, String(i)],
    )
  }

  for (const n of DEMO_NOTIFICATIONS) {
    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, read_at, action_url, created_at) VALUES
       ($1, $2, $3, $4, $5, $6, NOW() - ($7::int * interval '1 day'))`,
      [
        ID.userStudent,
        n.type,
        n.title,
        n.body,
        n.unread ? null : new Date(),
        n.action,
        String(n.daysAgo),
      ],
    )
  }

  for (const row of LOOKUP_CODES) {
    await client.query(
      `INSERT INTO lookup_records (national_id_or_code, student_name, license_class, result_status, updated_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [row.code, row.name, row.license, row.status],
    )
  }

  const chatSessions = [
    { id: ID.chatSession1, title: "Lỗi vượt đèn đỏ xe máy 2024", messages: [
      ["assistant", "Xin chào! Tôi là trợ lý pháp lý DriveGo — hỏi tôi về luật giao thông nhé."],
      ["user", "Lỗi vượt đèn đỏ xe máy phạt bao nhiêu?"],
      ["assistant", "Theo Nghị định 100/2019/NĐ-CP: phạt 800.000 – 1.000.000 VNĐ, có thể tước GPLX 1–3 tháng."],
    ]},
    { id: ID.chatSession2, title: "Giải đáp câu hỏi thi bằng", messages: [
      ["user", "Câu điểm liệt là gì?"],
      ["assistant", "Câu điểm liệt là câu hỏi bắt buộc phải trả lời đúng. Sai một câu điểm liệt là trượt toàn bài thi lý thuyết."],
    ]},
    { id: ID.chatSession3, title: "Mức phạt nồng độ cồn", messages: [
      ["user", "Uống rượu bia lái xe ô tô bị phạt thế nào?"],
      ["assistant", "Mức phạt tùy nồng độ cồn, có thể phạt tiền, tước GPLX và truy cứu hình sự nếu gây hậu quả nghiêm trọng."],
    ]},
  ]

  for (const session of chatSessions) {
    await client.query(
      `INSERT INTO chat_sessions (id, user_id, title) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
      [session.id, ID.userStudent, session.title],
    )
    for (const [role, content] of session.messages) {
      await client.query(
        `INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)`,
        [session.id, role, content],
      )
    }
  }
}

async function main() {
  await client.connect()
  console.log("Seeding DriveGo demo data...")
  await client.query("BEGIN")
  try {
    await clearDemoData()
    await seed()
    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  }

  const counts = await client.query(`
    SELECT 'users' AS entity, COUNT(*)::int AS n FROM users
    UNION ALL SELECT 'questions', COUNT(*) FROM questions
    UNION ALL SELECT 'exam_papers', COUNT(*) FROM exam_papers
    UNION ALL SELECT 'exam_attempts', COUNT(*) FROM exam_attempts
    UNION ALL SELECT 'study_chapters', COUNT(*) FROM study_chapters
    UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
    UNION ALL SELECT 'document_articles', COUNT(*) FROM document_articles
    UNION ALL SELECT 'schedule_slots', COUNT(*) FROM schedule_slots
    UNION ALL SELECT 'lookup_records', COUNT(*) FROM lookup_records
    UNION ALL SELECT 'chat_sessions', COUNT(*) FROM chat_sessions
  `)

  console.log("\nDemo accounts (password: DriveGo123!):")
  DEMO_EMAILS.forEach((email) => console.log(" -", email))
  console.log("\nLookup codes:", LOOKUP_CODE_LIST.join(", "))
  console.log("\nRow counts:")
  counts.rows.forEach((r) => console.log(` - ${r.entity}: ${r.n}`))
  await client.end()
  console.log("\nSeed completed.")
}

main().catch((err) => {
  console.error("Seed failed:", err.message)
  process.exit(1)
})
