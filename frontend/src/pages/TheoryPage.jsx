import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { EnrollmentConsentCard } from "../components/EnrollmentConsentCard.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { apiFetch } from "../lib/api.js"
import { toYoutubeEmbedUrl, toYoutubeWatchUrl } from "../lib/youtube.js"
import { t } from "../lib/strings.js"

export function TheoryPage() {
  const [chapters, setChapters] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await apiFetch("/study/chapters?licenseClass=B2", { auth: true })
        if (!cancelled) {
          setChapters(data)
          if (data[0]) setActiveId(data[0].id)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không tải được bài học")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const active = useMemo(
    () => chapters.find((c) => c.id === activeId) ?? chapters[0],
    [chapters, activeId],
  )

  const overallPercent = useMemo(() => {
    if (!chapters.length) return 0
    const sum = chapters.reduce((acc, c) => acc + (c.percent ?? 0), 0)
    return Math.round(sum / chapters.length)
  }, [chapters])

  async function markProgress(percent) {
    if (!active) return
    setSaving(true)
    try {
      await apiFetch(`/study/chapters/${active.id}/progress`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ percent }),
      })
      setChapters((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? { ...c, percent: Math.max(c.percent ?? 0, percent) }
            : c,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không lưu tiến độ")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-drive-muted">Đang tải lộ trình…</p>
  if (error && !chapters.length) return <p className="text-drive-danger">{error}</p>

  const embedSrc = toYoutubeEmbedUrl(active?.videoUrl)
  const watchUrl = toYoutubeWatchUrl(active?.videoUrl)

  const content = (
    <section className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <UiCard padding="lg" variant="panel">
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {t("pages.theory.title")}{" "}
            <span className="text-drive-action">{t("pages.theory.titleHighlight")}</span>
          </h1>
          <p className="mt-4 text-drive-muted">{t("pages.theory.subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton
              variant="action"
              onClick={() => document.getElementById("theory-video")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("pages.theory.startNow")}
            </PrimaryButton>
            <Link to="/exam">
              <PrimaryButton variant="outline">Thi thử ngay</PrimaryButton>
            </Link>
          </div>
        </UiCard>
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">Bài học hiện tại</p>
          <p className="mt-2 font-semibold text-white">{active?.title ?? "—"}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-drive-elevated">
            <div
              className="h-full rounded-full bg-drive-action transition-all"
              style={{ width: `${active?.percent ?? 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-drive-muted">
            Tiến độ chung: {overallPercent}% · {chapters.length} chương
          </p>
        </UiCard>
      </div>

      <UiCard id="theory-video" variant="panel">
        <h2 className="text-xl font-semibold text-white">{active?.title}</h2>
        {active?.description ? (
          <p className="mt-2 text-sm text-drive-muted">{active.description}</p>
        ) : null}
        {embedSrc ? (
          <div className="mt-4 space-y-2">
            <div className="aspect-video overflow-hidden rounded-drive border border-drive-border-soft bg-black">
              <iframe
                title={active.title}
                src={embedSrc}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            {watchUrl ? (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-drive-action hover:underline"
              >
                Video không phát? Mở trên YouTube
              </a>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-drive-muted">Chưa có video cho chương này.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <PrimaryButton variant="action" disabled={saving} onClick={() => markProgress(50)}>
            Đã xem 50%
          </PrimaryButton>
          <PrimaryButton variant="outline" disabled={saving} onClick={() => markProgress(100)}>
            Hoàn thành chương
          </PrimaryButton>
        </div>
      </UiCard>

      <UiCard variant="panel">
        <h2 className="text-xl font-semibold text-white">{t("pages.theory.roadmap")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => setActiveId(chapter.id)}
              className={`rounded-drive border p-4 text-left transition ${
                chapter.id === active?.id
                  ? "border-drive-action bg-drive-action/10"
                  : "border-drive-border-soft bg-drive-sidebar hover:border-drive-action/50"
              }`}
            >
              <p className="font-semibold text-white">{chapter.title}</p>
              <p className="mt-1 text-xs text-drive-muted">
                {chapter.durationMinutes ?? 35} phút · {chapter.percent ?? 0}%
              </p>
              {chapter.videoUrl ? (
                <p className="mt-2 text-[10px] uppercase tracking-wide text-drive-action">Có video</p>
              ) : null}
            </button>
          ))}
        </div>
      </UiCard>
      {error ? <p className="text-sm text-drive-danger">{error}</p> : null}
    </section>
  )

  return (
    <EnrollmentConsentCard
      storageKey="drivego_consent_theory_v1"
      title={t("consent.theoryTitle")}
      bullets={[
        t("consent.theoryBullet1"),
        t("consent.theoryBullet2"),
      ]}
      confirmLabel={t("consent.theoryConfirm")}
    >
      {content}
    </EnrollmentConsentCard>
  )
}
