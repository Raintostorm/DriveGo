import { useEffect, useState } from "react"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { apiFetch } from "../lib/api.js"
import { t } from "../lib/strings.js"

const faqItems = [
  {
    q: "Tôi có thể tải tài liệu về học offline không?",
    a: "Có, bạn có thể tải PDF hướng dẫn và bộ đề mẫu từ trang Tài liệu.",
  },
  {
    q: "Ứng dụng DriveGo có cập nhật câu hỏi mới nhất không?",
    a: "Có, hệ thống tự động cập nhật khi Bộ GTVT thay đổi bộ đề hoặc quy định sát hạch.",
    open: true,
  },
  {
    q: "Làm sao để đăng ký thi thử tại trung tâm?",
    a: "Vào mục Lịch thi, chọn ngày và ca thi, sau đó bấm Đăng ký.",
  },
]

export function DocsPage() {
  const [openFaq, setOpenFaq] = useState(1)
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const q = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""
        const data = await apiFetch(`/articles${q}`)
        if (!cancelled) {
          setArticles(data)
          if (data[0] && !selected) setSelected(data[0])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    const timer = setTimeout(load, search ? 300 : 0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [search])

  const active = selected ?? articles[0]

  return (
    <section className="space-y-10">
      <UiCard as="header" padding="lg" variant="panel" className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {t("pages.docs.title")}{" "}
          <span className="text-drive-action">{t("pages.docs.titleHighlight")}</span> {t("brand")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-drive-muted">{t("pages.docs.subtitle")}</p>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("pages.docs.searchPlaceholder")}
          className="mx-auto mt-5 block w-full max-w-2xl rounded-drive-pill border border-drive-border bg-drive-elevated px-5 py-3 text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
        />
      </UiCard>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr_240px]">
        <UiCard as="nav" padding="sm" variant="panel" className="hidden lg:block">
          <p className="text-xs font-semibold uppercase text-drive-placeholder">Bài viết</p>
          <ul className="mt-3 space-y-2 text-sm">
            {articles.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setSelected(a)}
                  className={`text-left ${active?.id === a.id ? "font-medium text-drive-action" : "text-drive-muted hover:text-white"}`}
                >
                  {a.title}
                </button>
              </li>
            ))}
          </ul>
        </UiCard>

        <UiCard as="article" padding="lg" variant="panel">
          {loading ? (
            <p className="text-drive-muted">Đang tải…</p>
          ) : active ? (
            <>
              <p className="text-xs text-drive-placeholder">
                Tài liệu › {active.category} › {active.slug}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{active.title}</h2>
              <p className="mt-2 text-xs text-drive-placeholder">
                Cập nhật {new Date(active.updatedAt).toLocaleDateString("vi-VN")}
              </p>
              <div className="mt-4 rounded-drive border border-drive-accent/30 bg-drive-accent/10 p-4 text-sm text-drive-text">
                {active.body}
              </div>
            </>
          ) : (
            <p className="text-drive-muted">Không tìm thấy bài viết.</p>
          )}
        </UiCard>

        <aside className="space-y-4">
          <UiCard variant="panel">
            <h3 className="font-semibold text-white">{t("pages.docs.toc")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-drive-muted">
              {articles.slice(0, 4).map((a) => (
                <li key={a.id}>{a.category}</li>
              ))}
            </ul>
          </UiCard>
        </aside>
      </div>

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold text-white">{t("pages.docs.faq")}</h2>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <button key={item.q} type="button" className="w-full text-left" onClick={() => setOpenFaq(i)}>
              <UiCard padding="sm" variant="panel" className="cursor-pointer">
                <div className="flex items-center justify-between text-white">
                  <span className="font-medium">{item.q}</span>
                  <span className="text-drive-muted">{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && item.a ? <p className="mt-3 text-sm text-drive-muted">{item.a}</p> : null}
              </UiCard>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
