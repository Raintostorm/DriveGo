/**
 * Import chapters, exam papers, articles for one license class.
 *
 * Usage:
 *   npm run import:content -- B2 database/content/B2
 *   node database/scripts/import-license-content.mjs A1 ./database/content/A1
 */
import { randomUUID } from "crypto"
import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const STUDY_CODES = ["A1", "A2", "B1", "B2"]

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  const envPath = resolve(__dirname, "../.env")
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, "utf8")
      .split("\n")
      .find((l) => l.startsWith("DATABASE_URL="))
    if (line) return line.slice("DATABASE_URL=".length).trim()
  }
  return "postgresql://postgres:12345@localhost:5432/DriveGo"
}

function readJson(path) {
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, "utf8"))
}

const licenseCode = process.argv[2]
const contentDir = process.argv[3]

if (!licenseCode || !STUDY_CODES.includes(licenseCode)) {
  console.error("Usage: npm run import:content -- <A1|A2|B1|B2> <folder>")
  process.exit(1)
}

if (!contentDir || !existsSync(contentDir)) {
  console.error(`Folder not found: ${contentDir}`)
  process.exit(1)
}

const client = new pg.Client({ connectionString: loadDatabaseUrl() })

try {
  await client.connect()

  const licenseRow = await client.query(
    `SELECT id, questions_per_exam, papers_count FROM license_classes WHERE code = $1`,
    [licenseCode],
  )
  if (licenseRow.rowCount === 0) {
    console.error(`license_classes missing code: ${licenseCode}. Run seed:db first.`)
    process.exit(1)
  }
  const licenseClassId = licenseRow.rows[0].id
  const expectedPerExam = Number(licenseRow.rows[0].questions_per_exam ?? 30)
  const expectedPapers = Number(licenseRow.rows[0].papers_count ?? 20)

  await client.query(
    `DELETE FROM exam_attempts WHERE paper_id IN (SELECT id FROM exam_papers WHERE license_class = $1)`,
    [licenseCode],
  )
  await client.query(
    `DELETE FROM questions WHERE paper_id IN (SELECT id FROM exam_papers WHERE license_class = $1)`,
    [licenseCode],
  )
  await client.query(`DELETE FROM exam_papers WHERE license_class = $1`, [licenseCode])

  const chaptersPath = join(contentDir, "chapters.json")
  const chaptersData = readJson(chaptersPath)
  if (chaptersData?.chapters?.length) {
    for (const ch of chaptersData.chapters) {
      const id = ch.id ?? randomUUID()
      await client.query(
        `INSERT INTO study_chapters (id, license_class_id, title, sort_order, duration_minutes, video_url, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           license_class_id = EXCLUDED.license_class_id,
           title = EXCLUDED.title,
           sort_order = EXCLUDED.sort_order,
           duration_minutes = EXCLUDED.duration_minutes,
           video_url = EXCLUDED.video_url,
           description = EXCLUDED.description`,
        [
          id,
          licenseClassId,
          ch.title,
          ch.sortOrder ?? 0,
          ch.durationMinutes ?? 30,
          ch.videoUrl ?? null,
          ch.description ?? null,
        ],
      )
    }
    console.log(`Chapters: ${chaptersData.chapters.length}`)
  }

  const papersPath = join(contentDir, "papers.json")
  const papersData = readJson(papersPath)
  if (papersData?.papers?.length) {
    if (papersData.papers.length !== expectedPapers) {
      console.warn(
        `Warning: ${licenseCode} has ${papersData.papers.length} papers in JSON, catalog expects ${expectedPapers} (import continues).`,
      )
    }
    for (const paper of papersData.papers) {
      const paperId = paper.id ?? randomUUID()
      const questions = paper.questions ?? []
      const declaredCount = paper.questionCount ?? questions.length
      if (questions.length !== declaredCount) {
        console.error(
          `Paper #${paper.paperNumber}: questions.length (${questions.length}) !== questionCount (${declaredCount})`,
        )
        process.exit(1)
      }
      if (questions.length !== expectedPerExam) {
        console.error(
          `Paper #${paper.paperNumber}: expected ${expectedPerExam} questions for ${licenseCode}, got ${questions.length}`,
        )
        process.exit(1)
      }
      await client.query(
        `INSERT INTO exam_papers (id, license_class, paper_number, question_count, is_mock)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET
           license_class = EXCLUDED.license_class,
           paper_number = EXCLUDED.paper_number,
           question_count = EXCLUDED.question_count,
           is_mock = EXCLUDED.is_mock`,
        [
          paperId,
          licenseCode,
          paper.paperNumber,
          questions.length,
          paper.isMock ?? true,
        ],
      )

      await client.query(`DELETE FROM questions WHERE paper_id = $1`, [paperId])

      for (const q of questions) {
        await client.query(
          `INSERT INTO questions (id, paper_id, body, image_url, answers, correct_index, is_critical)
           VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb, $5, $6)`,
          [
            paperId,
            q.body,
            q.imageUrl ?? null,
            JSON.stringify(q.answers ?? []),
            q.correctIndex ?? 0,
            q.isCritical ?? false,
          ],
        )
      }
      console.log(`Paper #${paper.paperNumber}: ${questions.length} questions`)
    }
  }

  const articlesPath = join(contentDir, "articles.json")
  const articlesData = readJson(articlesPath)
  if (articlesData?.articles?.length) {
    for (const a of articlesData.articles) {
      await client.query(
        `INSERT INTO document_articles (slug, title, body, category, license_class, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           body = EXCLUDED.body,
           category = EXCLUDED.category,
           license_class = EXCLUDED.license_class,
           updated_at = NOW()`,
        [a.slug, a.title, a.body, a.category ?? null, a.licenseClass ?? licenseCode],
      )
    }
    console.log(`Articles: ${articlesData.articles.length}`)
  }

  console.log(`Done import for ${licenseCode} from ${contentDir}`)
} finally {
  await client.end()
}
