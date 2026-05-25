import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { apiFetch } from "../lib/api.js"
import { DEFAULT_LICENSE_CLASS, isStudyLicenseCode } from "../lib/license-classes.js"
import { useAuth } from "./AuthContext.jsx"

const LicenseContext = createContext(null)

export function LicenseProvider({ children }) {
  const { user, refreshUser, isAuthenticated } = useAuth()
  const [catalog, setCatalog] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [enrollments, setEnrollments] = useState([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false)

  const refreshEnrollments = useCallback(async () => {
    if (!isAuthenticated) {
      setEnrollments([])
      return
    }
    setEnrollmentsLoading(true)
    try {
      const data = await apiFetch("/enrollments/me", { auth: true })
      setEnrollments(Array.isArray(data) ? data : [])
    } catch {
      setEnrollments([])
    } finally {
      setEnrollmentsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    let cancelled = false
    apiFetch("/license-classes")
      .then((data) => {
        if (!cancelled) setCatalog(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setCatalog([])
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    refreshEnrollments()
  }, [refreshEnrollments])

  const activeClass = useMemo(() => {
    const fromProfile = user?.profile?.licenseClass
    if (fromProfile && isStudyLicenseCode(fromProfile)) return fromProfile
    return DEFAULT_LICENSE_CLASS
  }, [user])

  const activeEntry = useMemo(
    () => catalog.find((c) => c.code === activeClass) ?? null,
    [catalog, activeClass],
  )

  const isContentReady = activeEntry?.contentReady ?? activeClass === DEFAULT_LICENSE_CLASS

  const enrolledClasses = useMemo(
    () => new Set(enrollments.map((e) => e.licenseClass)),
    [enrollments],
  )

  const isEnrolled = useCallback(
    (code) => enrolledClasses.has(code ?? activeClass),
    [enrolledClasses, activeClass],
  )

  const setActiveClass = useCallback(
    async (code) => {
      if (!isStudyLicenseCode(code)) return
      await apiFetch("/users/me", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ licenseClass: code }),
      })
      await refreshUser()
    },
    [refreshUser],
  )

  const value = useMemo(
    () => ({
      catalog,
      catalogLoading,
      activeClass,
      activeEntry,
      isContentReady,
      setActiveClass,
      isAuthenticated,
      enrollments,
      enrollmentsLoading,
      refreshEnrollments,
      isEnrolled,
    }),
    [
      catalog,
      catalogLoading,
      activeClass,
      activeEntry,
      isContentReady,
      setActiveClass,
      isAuthenticated,
      enrollments,
      enrollmentsLoading,
      refreshEnrollments,
      isEnrolled,
    ],
  )

  return <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
}

export function useLicense() {
  const ctx = useContext(LicenseContext)
  if (!ctx) throw new Error("useLicense must be used within LicenseProvider")
  return ctx
}
