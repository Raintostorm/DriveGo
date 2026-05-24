import { readFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const sqlPath = process.argv[2]

if (!sqlPath) {
  console.error("Usage: node database/scripts/run-migration.mjs <path-to.sql>")
  process.exit(1)
}

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

const absoluteSql = resolve(process.cwd(), sqlPath)
const sql = readFileSync(absoluteSql, "utf8")
const client = new pg.Client({ connectionString: loadDatabaseUrl() })

try {
  await client.connect()
  await client.query(sql)
  console.log(`Migration applied: ${sqlPath}`)
} finally {
  await client.end()
}
