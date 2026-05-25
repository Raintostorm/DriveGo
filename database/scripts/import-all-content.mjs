/**
 * Import chapters + papers for A1, A2, B1, B2.
 * Run bootstrap:content first.
 */
import { spawnSync } from "child_process"
import { existsSync } from "fs"
import { resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const ROOT = resolve(__dirname, "../..")
const IMPORT_SCRIPT = resolve(__dirname, "import-license-content.mjs")

const CODES = ["A1", "A2", "B1", "B2"]

for (const code of CODES) {
  const dir = resolve(ROOT, "database/content", code)
  if (!existsSync(dir)) {
    console.error(`Skip ${code}: folder missing — run npm run bootstrap:content`)
    process.exit(1)
  }
  console.log(`\n=== Import ${code} ===`)
  const r = spawnSync(process.execPath, [IMPORT_SCRIPT, code, dir], {
    stdio: "inherit",
    cwd: ROOT,
    env: process.env,
  })
  if (r.status !== 0) {
    process.exit(r.status ?? 1)
  }
}

console.log("\nAll license classes imported.")
