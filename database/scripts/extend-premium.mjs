/**
 * Gia hạn Premium trong DB — không cần chuyển khoản / SePay.
 * Giữ nguyên payments và premium_until hiện có nếu đã dài hơn.
 *
 * Usage:
 *   npm run extend-premium
 *   npm run extend-premium -- your@email.com
 *   npm run extend-premium -- your@email.com 365
 */
import pg from "pg"
import { readFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const email = process.argv[2] ?? "student@drivego.demo"
const days = Number(process.argv[3] ?? 365)

if (!email.includes("@")) {
  console.error("Usage: npm run extend-premium -- <email> [days]")
  process.exit(1)
}

const client = new pg.Client({ connectionString: loadDatabaseUrl() })

try {
  await client.connect()
  const res = await client.query(
    `UPDATE student_profiles sp
     SET premium_until = GREATEST(
       COALESCE(sp.premium_until, NOW()),
       NOW() + ($2::int || ' days')::interval
     )
     FROM users u
     WHERE sp.user_id = u.id AND u.email = $1
     RETURNING u.email, sp.premium_until`,
    [email, String(days)],
  )
  if (res.rowCount === 0) {
    console.error(`Không tìm thấy student_profiles cho email: ${email}`)
    process.exit(1)
  }
  console.log(`Đã gia hạn Premium cho ${res.rows[0].email}`)
  console.log(`premium_until = ${res.rows[0].premium_until}`)
  console.log("(Chạy seed:db vẫn không ghi đè premium_until — chỉ cập nhật full_name/phone)")
} finally {
  await client.end()
}
