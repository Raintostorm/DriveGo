import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useLicense } from "../context/LicenseContext.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatusBadge } from "../components/StatusBadge.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { apiFetch } from "../lib/api.js"
import { t } from "../lib/strings.js"

function toneForSlot(slot) {
  if (slot.full) return "danger"
  if (slot.remaining <= 5) return "warning"
  return "success"
}

export function SchedulePage() {
  const { activeClass, catalog, setActiveClass } = useLicense()
  const [licenseClass, setLicenseClass] = useState(activeClass)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [slotType, setSlotType] = useState("theory_exam")
  const [myRegs, setMyRegs] = useState([])
  const [pendingSlot, setPendingSlot] = useState(null)
  const [confirmChecked, setConfirmChecked] = useState(false)

  useEffect(() => {
    setLicenseClass(activeClass)
  }, [activeClass])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await apiFetch(
          `/schedules?licenseClass=${licenseClass}&slotType=${slotType}`,
        )
        if (!cancelled) setSlots(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [licenseClass, slotType])

  useEffect(() => {
    let cancelled = false
    apiFetch("/schedules/registrations/me", { auth: true })
      .then((data) => {
        if (!cancelled) setMyRegs(data)
      })
      .catch(() => {
        if (!cancelled) setMyRegs([])
      })
    return () => {
      cancelled = true
    }
  }, [message])

  const dates = useMemo(() => [...new Set(slots.map((s) => s.date))].sort(), [slots])
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (dates.length && !selectedDate) setSelectedDate(dates[0])
  }, [dates, selectedDate])

  const daySlots = slots.filter((s) => s.date === selectedDate)

  async function handleRegister(slotId) {
    setMessage(null)
    try {
      const res = await apiFetch("/schedules/registrations", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ slotId }),
      })
      setMessage(res?.message ?? "Đã gửi yêu cầu, chờ trung tâm xác nhận.")
      setPendingSlot(null)
      setConfirmChecked(false)
      const data = await apiFetch(
        `/schedules?licenseClass=${licenseClass}&slotType=${slotType}`,
      )
      setSlots(data)
      const regs = await apiFetch("/schedules/registrations/me", { auth: true })
      setMyRegs(regs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đăng ký thất bại"
      setMessage(msg)
      if (msg.includes("hồ sơ")) setPendingSlot(null)
    }
  }

  return (
    <section className="space-y-6">
      <UiCard padding="lg" variant="panel">
        <p className="text-sm font-medium text-drive-action">{t("brandHub")}</p>
        <h1 className="mt-2 text-4xl font-bold text-white">
          {t("pages.schedule.title")}{" "}
          <span className="text-drive-action">{t("pages.schedule.titleHighlight")}</span>
        </h1>
        <p className="mt-2 max-w-3xl text-drive-muted">{t("pages.schedule.subtitle")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {(catalog.length ? catalog : [{ code: "B2" }]).map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLicenseClass(item.code)
                setActiveClass(item.code)
              }}
              className={`rounded-drive px-4 py-2 text-sm ${
                licenseClass === item.code
                  ? "bg-drive-accent text-white"
                  : "border border-drive-border bg-drive-elevated text-drive-muted"
              }`}
            >
              Hạng {item.code}
              {item.hasScheduleSlots === false ? (
                <span className="ml-1 text-[10px] opacity-80">· {t("license.noSlots")}</span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSlotType("theory_exam")}
            className={`rounded-drive px-3 py-1.5 text-sm ${
              slotType === "theory_exam"
                ? "bg-drive-action text-white"
                : "border border-drive-border text-drive-muted"
            }`}
          >
            Sát hạch lý thuyết
          </button>
          <button
            type="button"
            onClick={() => setSlotType("road_test")}
            className={`rounded-drive px-3 py-1.5 text-sm ${
              slotType === "road_test"
                ? "bg-drive-action text-white"
                : "border border-drive-border text-drive-muted"
            }`}
          >
            Chạy thử / thực hành
          </button>
        </div>
      </UiCard>

      {myRegs.length > 0 ? (
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">Đăng ký của bạn</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {myRegs.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 text-drive-muted">
                <span>
                  {r.slot?.date
                    ? new Date(r.slot.date).toLocaleDateString("vi-VN")
                    : "—"}{" "}
                  {r.slot?.startTime ? String(r.slot.startTime).slice(0, 5) : ""}
                </span>
                <StatusBadge
                  tone={
                    r.status === "confirmed"
                      ? "success"
                      : r.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {r.status === "pending"
                    ? "Chờ xác nhận"
                    : r.status === "confirmed"
                      ? "Đã xác nhận"
                      : r.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </UiCard>
      ) : null}

      {message ? (
        <UiCard variant="panel">
          <p
            className={`text-sm ${message.includes("thất bại") || message.includes("hồ sơ") ? "text-drive-danger" : "text-drive-action"}`}
          >
            {message}
            {message.includes("hồ sơ") || message.includes("duyệt") ? (
              <>
                {" "}
                <Link to="/application" className="font-medium underline">
                  Hồ sơ sát hạch
                </Link>
              </>
            ) : null}
          </p>
        </UiCard>
      ) : null}

      {pendingSlot ? (
        <UiCard variant="panel" className="border-drive-action/40">
          <h2 className="font-semibold text-white">{t("consent.scheduleTitle")}</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-drive-muted">
            <li>{t("consent.scheduleBullet1")}</li>
            <li>{t("consent.scheduleBullet2")}</li>
          </ul>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-drive-text">
            <input
              type="checkbox"
              className="mt-1 accent-drive-action"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
            />
            <span>{t("consent.scheduleConfirm")}</span>
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton
              variant="action"
              disabled={!confirmChecked}
              onClick={() => handleRegister(pendingSlot)}
            >
              Xác nhận đăng ký
            </PrimaryButton>
            <button
              type="button"
              className="rounded-drive-pill border border-drive-border px-4 py-2 text-sm text-drive-muted hover:text-white"
              onClick={() => {
                setPendingSlot(null)
                setConfirmChecked(false)
              }}
            >
              {t("common.cancel")}
            </button>
          </div>
        </UiCard>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">Ngày có lịch thi</h2>
          {loading ? (
            <p className="mt-4 text-drive-muted">Đang tải…</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    selectedDate === date
                      ? "bg-drive-action font-semibold text-white"
                      : "bg-drive-elevated text-drive-muted hover:text-white"
                  }`}
                >
                  {new Date(date).toLocaleDateString("vi-VN")}
                </button>
              ))}
            </div>
          )}
        </UiCard>

        <UiCard variant="panel">
          <h2 className="font-semibold text-white">
            {t("pages.schedule.slotsTitle")}{" "}
            {selectedDate ? new Date(selectedDate).toLocaleDateString("vi-VN") : ""}
          </h2>
          <div className="mt-4 space-y-3">
            {daySlots.length === 0 ? (
              <p className="text-sm text-drive-muted">Không có ca thi trong ngày này.</p>
            ) : (
              daySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-drive border border-drive-border-soft bg-drive-sidebar p-3"
                >
                  <p className="font-medium text-white">{slot.timeLabel}</p>
                  <p className="text-xs text-drive-muted">
                    {slot.venue} {slot.centerName ? `— ${slot.centerName}` : ""}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge tone={toneForSlot(slot)}>{slot.seatsLabel}</StatusBadge>
                    {!slot.full ? (
                      <PrimaryButton
                        variant="action"
                        className="!py-1.5 !text-xs"
                        onClick={() => {
                          setPendingSlot(slot.id)
                          setConfirmChecked(false)
                          setMessage(null)
                        }}
                      >
                        {t("common.registerNow")}
                      </PrimaryButton>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </UiCard>
      </div>
    </section>
  )
}
