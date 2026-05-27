import { Link } from "react-router-dom"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function HomePage() {
  const features = [
    { title: t("pages.home.feature1"), desc: "Video bài giảng và mô phỏng tình huống trên mọi thiết bị." },
    { title: t("pages.home.feature2"), desc: "Ngân hàng 600 câu hỏi và đề thi cập nhật theo quy định mới." },
    { title: t("pages.home.feature3"), desc: "Biểu đồ tiến độ, điểm yếu và gợi ý ôn tập cá nhân hóa." },
    { title: t("pages.home.feature4"), desc: "Mã hóa dữ liệu và xác thực đa lớp cho tài khoản học viên." },
  ]

  return (
    <section className="space-y-20">
      <div className="relative text-center">
        <div className="pointer-events-none absolute -left-20 top-0 size-80 rounded-full bg-drive-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-drive-action/15 blur-3xl" />
        <p className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-drive-border bg-drive-elevated/80 px-4 py-1.5 text-xs font-medium text-drive-muted">
          <span className="size-2 rounded-full bg-drive-success" />
          {t("pages.home.badge")}
        </p>
        <h1 className="relative text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          {t("pages.home.title")}
          <br />
          <span className="bg-gradient-to-r from-drive-accent to-drive-action bg-clip-text text-transparent">
            {t("pages.home.titleHighlight")}
          </span>
        </h1>
        <p className="relative mx-auto mt-6 max-w-2xl text-base leading-relaxed text-drive-muted">
          {t("pages.home.subtitle")}
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="rounded-drive-pill bg-drive-action px-6 py-3 text-sm font-bold text-white shadow-drive-action transition hover:brightness-110"
          >
            {t("common.startFree")}
          </Link>
          <Link
            to="/exam"
            className="rounded-drive-pill border border-drive-border bg-drive-elevated px-6 py-3 text-sm font-bold text-white transition hover:bg-drive-panel"
          >
            {t("common.viewDemo")}
          </Link>
        </div>
      </div>

      <UiCard variant="panel" padding="none" className="overflow-hidden">
        <div className="border-b border-drive-border-soft bg-drive-sidebar px-4 py-2">
          <div className="flex gap-2">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-amber-500/80" />
            <span className="size-3 rounded-full bg-drive-success/80" />
          </div>
        </div>
        <div className="aspect-video bg-gradient-to-br from-drive-panel via-drive-elevated to-drive-sidebar" />
      </UiCard>

      <div>
        <h2 className="mb-8 text-center text-2xl font-bold text-white">{t("pages.home.featuresTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, desc }) => (
            <UiCard key={title} variant="panel" as="article">
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-drive-muted">{desc}</p>
            </UiCard>
          ))}
        </div>
      </div>

      <UiCard variant="panel" className="text-center">
        <p className="text-sm font-medium text-drive-action">Gói học phổ biến</p>
        <h3 className="mt-2 text-2xl font-bold text-white">Bằng B2 — từ 15.000.000đ</h3>
        <Link
          to="/pricing"
          className="mt-6 inline-block rounded-drive-pill bg-drive-action px-6 py-3 text-sm font-bold text-white shadow-drive-action transition hover:brightness-110"
        >
          {t("common.viewAll")}
        </Link>
      </UiCard>
    </section>
  )
}
