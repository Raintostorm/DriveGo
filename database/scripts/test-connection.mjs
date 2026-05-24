import pg from "pg"

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:12345@localhost:5432/DriveGo"

const client = new pg.Client({ connectionString: DATABASE_URL })

async function main() {
  await client.connect()
  const version = await client.query("SELECT version()")
  const tables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `)

  console.log("Connected:", version.rows[0].version.split(",")[0])
  console.log("Tables:", tables.rowCount)
  tables.rows.forEach((row) => console.log(" -", row.table_name))

  const smokeEmail = `test-${Date.now()}@drivego.local`
  await client.query("BEGIN")
  await client.query(
    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)`,
    [smokeEmail, "hash-smoke-test", "student"],
  )
  const inserted = await client.query(`SELECT id, email, role FROM users WHERE email = $1`, [
    smokeEmail,
  ])
  await client.query(`DELETE FROM users WHERE email = $1`, [smokeEmail])
  await client.query("COMMIT")

  console.log("Smoke insert/select/delete: OK", inserted.rows[0])
  await client.end()
}

main().catch((err) => {
  console.error("Database test failed:", err.message)
  process.exit(1)
})
