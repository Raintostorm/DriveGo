import { useState } from "react"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
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
          placeholder={t("pages.docs.searchPlaceholder")}
          className="mx-auto mt-5 block w-full max-w-2xl rounded-drive-pill border border-drive-border bg-drive-elevated px-5 py-3 text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
          {["#Lý thuyết", "#Thi thử", "#Quy trình đăng ký", "#Mẹo thi sa hình"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-drive-border bg-drive-elevated px-3 py-1 text-drive-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </UiCard>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr_240px]">
        <UiCard as="nav" padding="sm" variant="panel" className="hidden lg:block">
          <p className="text-xs font-semibold uppercase text-drive-placeholder">Bắt đầu</p>
          <ul className="mt-3 space-y-2 text-sm text-drive-muted">
            <li className="font-medium text-drive-action">Tổng quan DriveGo</li>
            <li>Tạo tài khoản học</li>
            <li>Hướng dẫn cài đặt App</li>
          </ul>
          <p className="mt-6 text-xs text-drive-success">● Dữ liệu thi 2024 — OK</p>
        </UiCard>

        <UiCard as="article" padding="lg" variant="panel">
          <p className="text-xs text-drive-placeholder">Tài liệu › Học lý thuyết › Hướng dẫn 600 câu</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Cấu trúc đề thi và hướng dẫn học 600 câu hỏi lý thuyết 2024
          </h2>
          <p className="mt-2 text-xs text-drive-placeholder">12 phút đọc · Cập nhật 2 ngày trước</p>
          <div className="mt-4 rounded-drive border border-drive-accent/30 bg-drive-accent/10 p-4 text-sm text-drive-text">
            <strong>Lưu ý quan trọng:</strong> Câu hỏi điểm liệt — sai một câu là trượt ngay.
          </div>
          <ol className="mt-5 space-y-3 text-sm text-drive-muted">
            <li>1. Nắm vững các nhóm biển báo.</li>
            <li>2. Học quy tắc ưu tiên tại giao lộ.</li>
            <li>3. Sử dụng tính năng Thi thử trên DriveGo.</li>
          </ol>
          <div className="mt-6 h-52 rounded-drive bg-gradient-to-r from-drive-panel to-drive-action/30" />
        </UiCard>

        <aside className="space-y-4">
          <UiCard variant="panel">
            <h3 className="font-semibold text-white">{t("pages.docs.toc")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-drive-muted">
              <li>Chiến lược 60 câu</li>
              <li>Câu điểm liệt</li>
              <li>Mẹo biển báo</li>
            </ul>
          </UiCard>
          <UiCard variant="panel">
            <PrimaryButton fullWidth variant="outline">
              {t("pages.docs.downloadPdf")}
            </PrimaryButton>
            <p className="mt-4 font-semibold text-white">{t("pages.docs.support")}</p>
            <PrimaryButton variant="action" fullWidth className="mt-2">
              {t("pages.docs.supportCta")}
            </PrimaryButton>
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
