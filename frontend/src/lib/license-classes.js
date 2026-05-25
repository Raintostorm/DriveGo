export const STUDY_LICENSE_CODES = ["A1", "A2", "B1", "B2"]

export const DEFAULT_LICENSE_CLASS = "B2"

export const LICENSE_LABELS = {
  A1: "A1 — Xe máy ≤ 125cc",
  A2: "A2 — Xe máy",
  B1: "B1 — Ô tô (số tự động)",
  B2: "B2 — Ô tô",
}

export function isStudyLicenseCode(code) {
  return STUDY_LICENSE_CODES.includes(code)
}
