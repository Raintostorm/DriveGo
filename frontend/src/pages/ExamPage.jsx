import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EnrollCourseCta } from "../components/EnrollCourseCta.jsx"
import { EnrollmentConsentCard } from "../components/EnrollmentConsentCard.jsx"
import { LicenseContentEmpty } from "../components/LicenseContentEmpty.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { useLicense } from "../context/LicenseContext.jsx"
import { apiFetch } from "../lib/api.js"
import { t } from "../lib/strings.js"

const EXAM_MINUTES = 22

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function ExamPage() {
  const navigate = useNavigate()
  const { activeClass, isEnrolled, enrollmentsLoading } = useLicense()
  const enrolled = isEnrolled(activeClass)
  const [paper, setPaper] = useState(null)
  const [papers, setPapers] = useState([])
  const [examContentReady, setExamContentReady] = useState(false)
  const [selectedPaperId, setSelectedPaperId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [confirmed, setConfirmed] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [startedAt] = useState(() => new Date().toISOString())
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60)
  useEffect(() => {
    if (!enrolled) return undefined
    let cancelled = false
    apiFetch(`/exams/papers?licenseClass=${activeClass}`, { auth: true })
      .then((data) => {
        if (!cancelled) {
          const list = data.papers ?? (Array.isArray(data) ? data : [])
          setPapers(list)
          setExamContentReady(Boolean(data.contentReady ?? list.length > 0))
          if (list[0]) setSelectedPaperId(list[0].id)
          else setSelectedPaperId(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Không tải được đề thi")
      })
    return () => {
      cancelled = true
    }
  }, [enrolled, activeClass])

  useEffect(() => {
    if (!enrolled || !selectedPaperId) return undefined
    let cancelled = false
    setLoading(true)
    apiFetch(`/exams/${selectedPaperId}`, { auth: true })
      .then((detail) => {
        if (!cancelled) {
          setPaper(detail)
          setCurrentIndex(0)
          setAnswers({})
          setConfirmed({})
          setResult(null)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Không tải được đề thi")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedPaperId, enrolled, activeClass])

  useEffect(() => {
    if (!paper || result) return undefined
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [paper, result])

  const questions = paper?.questions ?? []
  const question = questions[currentIndex]

  const { correctCount, wrongCount } = useMemo(() => {
    let correct = 0
    let wrong = 0
    for (const q of questions) {
      if (confirmed[q.id] === undefined) continue
      if (confirmed[q.id]) correct += 1
      else wrong += 1
    }
    return { correctCount: correct, wrongCount: wrong }
  }, [questions, confirmed])

  const handleConfirm = useCallback(() => {
    if (!question) return
    const selected = answers[question.id]
    if (selected === undefined) return
    const isCorrect = selected === question.correctIndex
    setConfirmed((prev) => ({ ...prev, [question.id]: isCorrect }))
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 400)
    }
  }, [question, answers, questions.length, currentIndex])

  async function handleSubmitExam() {
    if (!paper) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = {}
      for (const q of questions) {
        if (answers[q.id] !== undefined) payload[q.id] = answers[q.id]
      }
      const data = await apiFetch(`/exams/${paper.id}/attempts`, {
        method: "POST",
        auth: true,
        body: JSON.stringify({ answers: payload, startedAt }),
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nộp bài thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  if (enrollmentsLoading) return <p className="text-drive-muted">Đang kiểm tra đăng ký khóa…</p>

  if (!enrolled) {
    return <EnrollCourseCta licenseClass={activeClass} />
  }

  if (!examContentReady) {
    return (
      <EnrollmentConsentCard
        storageKey="drivego_consent_exam_v1"
        title={t("consent.examTitle")}
        bullets={[t("consent.examBullet1"), t("consent.examBullet2")]}
        confirmLabel={t("consent.examConfirm")}
      >
        <LicenseContentEmpty feature="exam" />
      </EnrollmentConsentCard>
    )
  }

  if (loading) return <p className="text-drive-muted">Đang tải đề thi…</p>
  if (error && !paper) {
    return (
      <p className="text-drive-danger">
        {error}{" "}
        {error.includes("đăng ký") ? (
          <Link to={`/enroll?class=${activeClass}`} className="font-medium text-drive-action underline">
            Đăng ký khóa
          </Link>
        ) : null}
      </p>
    )
  }

  if (result) {
    return (
      <UiCard variant="panel" className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold text-white">
          {result.passed ? "Chúc mừng — bạn đã đạt!" : "Chưa đạt — ôn thêm nhé"}
        </h1>
        <p className="mt-4 text-4xl font-bold text-drive-action">
          {result.correct}/{result.total}
        </p>
        <p className="mt-2 text-sm text-drive-muted">
          Cần tối thiểu {result.passThreshold}/{result.total} điểm và không sai câu điểm liệt
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PrimaryButton variant="action" onClick={() => navigate("/history")}>
            Xem lịch sử
          </PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => window.location.reload()}>
            Thi lại
          </PrimaryButton>
        </div>
      </UiCard>
    )
  }

  if (!question) return <p className="text-drive-muted">Đề thi trống.</p>

  const allAnswered = questions.every((q) => answers[q.id] !== undefined)
  const isLast = currentIndex === questions.length - 1
  const locked = confirmed[question.id] !== undefined

  const examUi = (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {papers.length > 1 ? (
        <div className="lg:col-span-2">
          <select
            value={selectedPaperId ?? ""}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="rounded-drive border border-drive-border bg-drive-elevated px-4 py-2 text-sm text-drive-text"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.questionCount} câu)
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <UiCard variant="panel" className="space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-2 rounded-drive border border-drive-border-soft bg-drive-sidebar p-4">
          <div>
            <p className="text-sm font-medium text-drive-action">
              {paper.title} — {t("pages.exam.questionLabel")} {question.index}/{questions.length}
            </p>
            <h1 className="mt-2 text-lg font-semibold text-white">{question.body}</h1>
          </div>
          {question.isCritical ? (
            <span className="rounded-drive-pill bg-drive-danger/20 px-3 py-1 text-xs font-semibold text-drive-danger">
              Điểm liệt
            </span>
          ) : null}
        </header>

        {question.imageUrl ? (
          <img src={question.imageUrl} alt="" className="h-56 w-full rounded-drive object-cover" />
        ) : (
          <div className="flex h-56 items-center justify-center rounded-drive bg-gradient-to-r from-drive-panel to-drive-action/25 text-sm text-drive-muted">
            {t("license.examQuestionLabel", { code: activeClass })}
          </div>
        )}

        <div className="space-y-3">
          {question.answers.map((answer, idx) => {
            const selected = answers[question.id] === idx
            let borderClass = "border-drive-border hover:border-drive-action"
            if (selected) borderClass = "border-drive-action bg-drive-action/10"
            if (locked && idx === question.correctIndex) {
              borderClass = "border-drive-success bg-drive-success/10"
            } else if (locked && selected && !confirmed[question.id]) {
              borderClass = "border-drive-danger bg-drive-danger/10"
            }

            return (
              <label
                key={answer}
                className={`flex cursor-pointer items-start gap-3 rounded-drive border bg-drive-elevated p-3 text-sm text-drive-text transition ${borderClass} ${locked ? "pointer-events-none opacity-90" : ""}`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  className="mt-1 accent-drive-action"
                  checked={selected}
                  disabled={locked}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: idx }))}
                />
                <span>{answer}</span>
              </label>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            Câu trước
          </PrimaryButton>
          {!isLast ? (
            <PrimaryButton variant="outline" onClick={() => setCurrentIndex((i) => i + 1)}>
              Câu sau
            </PrimaryButton>
          ) : null}
          {!locked ? (
            <PrimaryButton
              variant="action"
              disabled={answers[question.id] === undefined}
              onClick={handleConfirm}
            >
              Xác nhận câu trả lời
            </PrimaryButton>
          ) : null}
          {isLast && allAnswered ? (
            <PrimaryButton variant="action" disabled={submitting} onClick={handleSubmitExam}>
              {submitting ? "Đang nộp…" : "Nộp bài"}
            </PrimaryButton>
          ) : null}
        </div>
        {error ? (
          <p className="text-sm text-drive-danger">
            {error}{" "}
            {error.includes("Premium") || error.includes("miễn phí") ? (
              <Link to="/upgrade" className="font-medium text-drive-action underline">
                Nâng cấp ngay
              </Link>
            ) : null}
            {error.includes("hồ sơ") ? (
              <Link to="/application" className="font-medium text-drive-action underline">
                Nộp hồ sơ
              </Link>
            ) : null}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`size-8 rounded-lg text-xs font-medium ${
                idx === currentIndex
                  ? "bg-drive-action text-white"
                  : answers[q.id] !== undefined
                    ? "bg-drive-success/20 text-drive-success"
                    : "bg-drive-elevated text-drive-muted"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </UiCard>

      <aside className="space-y-4">
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">{t("pages.exam.timeLeft")}</p>
          <p
            className={`text-4xl font-bold ${secondsLeft < 60 ? "text-drive-danger" : "text-drive-action"}`}
          >
            {formatTime(secondsLeft)}
          </p>
        </UiCard>
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">{t("pages.exam.tempResult")}</p>
          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded-drive bg-drive-success/10 p-3 text-center">
              <p className="text-xl font-bold text-drive-success">{correctCount}</p>
              <p className="text-xs text-drive-muted">{t("pages.exam.correct")}</p>
            </div>
            <div className="flex-1 rounded-drive bg-drive-danger/10 p-3 text-center">
              <p className="text-xl font-bold text-drive-danger">{wrongCount}</p>
              <p className="text-xs text-drive-muted">{t("pages.exam.wrong")}</p>
            </div>
          </div>
        </UiCard>
        <UiCard variant="panel" className="text-sm text-drive-muted">
          <p>{t("license.examAside", { count: String(questions.length), code: activeClass })}</p>
          <Link to="/theory" className="mt-2 inline-block text-drive-action hover:underline">
            Ôn lý thuyết trước khi thi
          </Link>
        </UiCard>
      </aside>
    </section>
  )

  return (
    <EnrollmentConsentCard
      storageKey="drivego_consent_exam_v1"
      title={t("consent.examTitle")}
      bullets={[t("consent.examBullet1"), t("consent.examBullet2")]}
      confirmLabel={t("consent.examConfirm")}
    >
      {examUi}
    </EnrollmentConsentCard>
  )
}
