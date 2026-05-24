import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const chats = ["Lỗi vượt đèn đỏ xe máy 2024", "Giải đáp câu hỏi thi bằng", "Mức phạt nồng độ cồn"]

export function AiChatPage() {
  return (
    <section className="grid min-h-[70vh] gap-4 lg:grid-cols-[260px_1fr]">
      <UiCard padding="sm" variant="panel" className="flex flex-col">
        <PrimaryButton variant="action" className="mb-4">
          {t("pages.aiChat.newChat")}
        </PrimaryButton>
        <p className="mb-2 text-xs font-semibold uppercase text-drive-placeholder">Gần đây</p>
        {chats.map((c, i) => (
          <button
            key={c}
            type="button"
            className={`mb-1 rounded-lg px-3 py-2 text-left text-sm transition ${
              i === 0
                ? "bg-drive-action text-white"
                : "text-drive-muted hover:bg-drive-elevated hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
        <p className="mt-4 text-xs text-drive-muted">Tài khoản Pro</p>
      </UiCard>

      <UiCard variant="panel" className="flex flex-col">
        <h1 className="text-xl font-bold text-white">{t("pages.aiChat.title")}</h1>
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          <div className="max-w-xl rounded-drive border border-drive-border-soft bg-drive-sidebar p-3 text-sm text-drive-text">
            Xin chào! Tôi là trợ lý pháp lý DriveGo — hỏi tôi về luật giao thông nhé.
          </div>
          <div className="ml-auto max-w-xl rounded-drive bg-drive-accent p-3 text-sm text-white">
            Lỗi vượt đèn đỏ xe máy phạt bao nhiêu?
          </div>
          <UiCard padding="sm" variant="panel" className="max-w-xl border-drive-accent/30 bg-drive-accent/10">
            <p className="text-sm text-drive-text">Theo Nghị định 100/2019/NĐ-CP:</p>
            <p className="mt-2 font-bold text-drive-danger">800.000 – 1.000.000 VNĐ</p>
            <p className="mt-1 text-xs text-amber-300">Tước GPLX 1–3 tháng (bổ sung)</p>
          </UiCard>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder={t("pages.aiChat.placeholder")}
            className="flex-1 rounded-drive-pill border border-drive-border bg-drive-elevated px-4 py-3 text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
          />
          <PrimaryButton variant="action">{t("pages.aiChat.send")}</PrimaryButton>
        </div>
      </UiCard>
    </section>
  )
}
