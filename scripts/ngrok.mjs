/**
 * Chạy ngrok tunnel tới backend :3000 (SePay webhook local).
 * Đặt NGROK_PATH trong .env gốc nếu ngrok không có trong PATH.
 *
 * Ví dụ .env:
 *   NGROK_PATH=C:\Users\you\Downloads\ngrok-v3-stable-windows-amd64\ngrok.exe
 */
import { spawn } from "child_process"
import { existsSync, readFileSync } from "fs"
import { homedir, platform } from "os"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function loadNgrokFromEnvFile() {
  const envPath = join(root, ".env")
  if (!existsSync(envPath)) return null
  const line = readFileSync(envPath, "utf8")
    .split("\n")
    .find((l) => l.startsWith("NGROK_PATH="))
  if (!line) return null
  const value = line.slice("NGROK_PATH=".length).trim().replace(/^["']|["']$/g, "")
  return value || null
}

function findNgrokExecutable() {
  const candidates = [
    process.env.NGROK_PATH,
    loadNgrokFromEnvFile(),
    join(root, "ngrok.exe"),
    join(homedir(), "Downloads", "ngrok-v3-stable-windows-amd64", "ngrok.exe"),
  ].filter(Boolean)

  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return null
}

const bin = findNgrokExecutable()
if (!bin) {
  console.error(
    "[ngrok] Không tìm thấy ngrok.exe.\n" +
      "  • Thêm NGROK_PATH=... vào file .env ở thư mục gốc project\n" +
      "  • Hoặc copy ngrok.exe vào thư mục project\n" +
      "  • Hoặc cài ngrok vào PATH hệ thống\n",
  )
  process.exit(1)
}

const port = process.env.NGROK_PORT ?? "3000"
const child = spawn(bin, ["http", port], {
  stdio: "inherit",
  shell: platform() === "win32",
})

child.on("exit", (code) => process.exit(code ?? 0))
process.on("SIGINT", () => child.kill("SIGTERM"))
process.on("SIGTERM", () => child.kill("SIGTERM"))
