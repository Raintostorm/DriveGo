export const STUDY_LICENSE_CODES = ["A1", "A2", "B1", "B2"] as const

export type StudyLicenseCode = (typeof STUDY_LICENSE_CODES)[number]

export const LICENSE_LABELS: Record<string, string> = {
  A1: "A1 — Xe máy ≤ 125cc",
  A2: "A2 — Xe máy",
  B1: "B1 — Ô tô (số tự động)",
  B2: "B2 — Ô tô",
}

export function isStudyLicenseCode(code: string): code is StudyLicenseCode {
  return (STUDY_LICENSE_CODES as readonly string[]).includes(code)
}

export const DEFAULT_LICENSE_CLASS: StudyLicenseCode = "B2"
