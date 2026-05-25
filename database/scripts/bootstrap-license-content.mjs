/**
 * Generate chapters.json + papers.json for A1, A2, B1 from B2 source.
 * B2 papers.json gets stable paper IDs if missing.
 *
 * Usage: npm run bootstrap:content
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const ROOT = resolve(__dirname, "../..")
const B2_DIR = join(ROOT, "database/content/B2")

const CLASS_META = {
  A1: {
    chapterPrefix: "44444444-4444-4444-8441",
    paperPrefix: "55555555-5555-4555-8501",
    label: "xe máy A1",
    chapterTitles: [
      "Chương 1: Biển báo & hiệu lệnh (A1)",
      "Chương 2: Quy tắc giao thông xe máy",
      "Chương 3: Kỹ năng lái xe máy an toàn",
      "Chương 4: Ôn đề thi thử A1",
    ],
    chapterDesc: [
      "Biển báo và quy tắc cơ bản cho bằng A1.",
      "Ưu tiên, làn đường và khoảng cách khi điều khiển xe máy.",
      "Thao tác an toàn ban ngày/đêm và thời tiết xấu.",
      "Luyện 600 câu lý thuyết (đề thi thử).",
    ],
  },
  A2: {
    chapterPrefix: "44444444-4444-4444-8442",
    paperPrefix: "55555555-5555-4555-8502",
    label: "xe máy A2",
    chapterTitles: [
      "Chương 1: Biển báo & hiệu lệnh (A2)",
      "Chương 2: Quy tắc giao thông",
      "Chương 3: Kỹ năng lái xe máy",
      "Chương 4: Ôn đề thi thử A2",
    ],
    chapterDesc: [
      "Nhận biết biển báo cho hạng A2.",
      "Quy tắc ưu tiên và an toàn giao thông.",
      "Kỹ thuật lái xe máy trong đô thị.",
      "Luyện 600 câu lý thuyết (đề thi thử).",
    ],
  },
  B1: {
    chapterPrefix: "44444444-4444-4444-8443",
    paperPrefix: "55555555-5555-4555-8503",
    label: "ô tô B1",
    chapterTitles: [
      "Chương 1: Biển báo hiệu đường bộ (B1)",
      "Chương 2: Quy tắc giao thông",
      "Chương 3: Kỹ thuật lái ô tô",
      "Chương 4: Giải đề thi thử B1",
    ],
    chapterDesc: [
      "Biển báo cho người điều khiển ô tô hạng B1.",
      "Quy tắc ưu tiên, làn đường và khoảng cách.",
      "Lái ban đêm, mưa và cao tốc.",
      "Luyện 600 câu lý thuyết (đề thi thử).",
    ],
  },
  B2: {
    chapterPrefix: "44444444-4444-4444-8444",
    paperPrefix: "55555555-5555-4555-8555",
    label: "ô tô B2",
    chapterTitles: null,
    chapterDesc: null,
  },
}

const B2_VIDEOS = [
  "https://www.youtube-nocookie.com/embed/8ndOIY5FNeo?rel=0&modestbranding=1",
  "https://www.youtube-nocookie.com/embed/jEqaK9lvlvA?rel=0&modestbranding=1",
  "https://www.youtube-nocookie.com/embed/MFx-VLUi4tw?rel=0&modestbranding=1",
  "https://www.youtube-nocookie.com/embed/Uv_j-wkRFHE?rel=0&modestbranding=1",
]

function paperId(prefix, paperNumber) {
  const n = String(paperNumber).padStart(3, "0")
  return `${prefix}-0000000${n}01`
}

function chapterId(prefix, sortOrder) {
  return `${prefix}-44444444440${sortOrder}`
}

function readB2Papers() {
  const path = join(B2_DIR, "papers.json")
  if (!existsSync(path)) {
    console.error("Missing database/content/B2/papers.json — run parse:b2-pdf first.")
    process.exit(1)
  }
  return JSON.parse(readFileSync(path, "utf8"))
}

function clonePapersForClass(source, code) {
  const meta = CLASS_META[code]
  return {
    papers: source.papers.map((p) => ({
      id: paperId(meta.paperPrefix, p.paperNumber),
      paperNumber: p.paperNumber,
      questionCount: p.questionCount,
      isMock: p.isMock ?? true,
      questions: (p.questions ?? []).map((q) => ({
        ...q,
        imageUrl: q.imageUrl ?? null,
      })),
    })),
  }
}

function buildChapters(code) {
  const meta = CLASS_META[code]
  const b2Chapters = JSON.parse(readFileSync(join(B2_DIR, "chapters.json"), "utf8")).chapters

  return {
    chapters: b2Chapters.map((ch, i) => ({
      id: chapterId(meta.chapterPrefix, ch.sortOrder ?? i + 1),
      title: meta.chapterTitles?.[i] ?? ch.title,
      sortOrder: ch.sortOrder ?? i + 1,
      durationMinutes: ch.durationMinutes ?? 30,
      videoUrl: ch.videoUrl ?? B2_VIDEOS[i],
      description: meta.chapterDesc?.[i] ?? ch.description,
    })),
  }
}

function writeJson(dir, name, data) {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, name), `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

const source = readB2Papers()

// B2: ensure stable paper IDs in papers.json
const b2Papers = clonePapersForClass(source, "B2")
writeJson(B2_DIR, "papers.json", b2Papers)
console.log(`B2 papers.json: ${b2Papers.papers.length} papers (IDs assigned)`)

if (!existsSync(join(B2_DIR, "chapters.json"))) {
  console.error("Missing B2/chapters.json")
  process.exit(1)
}

for (const code of ["A1", "A2", "B1"]) {
  const dir = join(ROOT, "database/content", code)
  writeJson(dir, "papers.json", clonePapersForClass(source, code))
  writeJson(dir, "chapters.json", buildChapters(code))
  console.log(`${code}: chapters + ${source.papers.length} papers written`)
}

console.log("Bootstrap done. Run: npm run import:content:all")
