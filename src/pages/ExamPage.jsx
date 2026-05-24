import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const answers = [
  "Tăng tốc và ra hiệu cho xe sau vượt.",
  "Giảm tốc, đi sát lề phải cho xe sau vượt.",
  "Bấm còi liên tục để cảnh báo.",
]

export function ExamPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <UiCard variant="panel" className="space-y-4">
        <header className="rounded-drive border border-drive-border-soft bg-drive-sidebar p-4">
          <p className="text-sm font-medium text-drive-action">{t("pages.exam.questionLabel")} 12</p>
          <h1 className="mt-2 text-lg font-semibold text-white">
            Khi điều khiển xe trên đường biết có xe sau xin vượt, nếu đủ điều kiện an toàn bạn cần?
          </h1>
        </header>
        <div className="h-56 rounded-drive bg-gradient-to-r from-drive-panel to-drive-action/25" />
        <div className="space-y-3">
          {answers.map((answer) => (
            <label
              key={answer}
              className="flex cursor-pointer items-start gap-3 rounded-drive border border-drive-border bg-drive-elevated p-3 text-sm text-drive-text transition hover:border-drive-action"
            >
              <input type="radio" name="answer" className="mt-1 accent-drive-action" />
              <span>{answer}</span>
            </label>
          ))}
        </div>
        <PrimaryButton variant="action">Xác nhận câu trả lời</PrimaryButton>
      </UiCard>

      <aside className="space-y-4">
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">{t("pages.exam.timeLeft")}</p>
          <p className="text-4xl font-bold text-drive-action">14:45</p>
        </UiCard>
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">{t("pages.exam.tempResult")}</p>
          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded-drive bg-drive-success/10 p-3 text-center">
              <p className="text-xl font-bold text-drive-success">12</p>
              <p className="text-xs text-drive-muted">{t("pages.exam.correct")}</p>
            </div>
            <div className="flex-1 rounded-drive bg-drive-danger/10 p-3 text-center">
              <p className="text-xl font-bold text-drive-danger">0</p>
              <p className="text-xs text-drive-muted">{t("pages.exam.wrong")}</p>
            </div>
          </div>
        </UiCard>
      </aside>
    </section>
  )
}
