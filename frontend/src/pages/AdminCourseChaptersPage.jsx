import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { fetchAdminChapters, patchAdminChapter } from "../lib/admin-api.js"

export function AdminCourseChaptersPage() {
  const { user } = useAuth()
  const readOnly = user?.role === "center_admin"
  const { code } = useParams()
  const [chapters, setChapters] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAdminChapters(code)
      .then((data) => setChapters(Array.isArray(data) ? data : (data.chapters ?? [])))
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
  }, [code])

  async function saveChapter(ch) {
    try {
      const updated = await patchAdminChapter(ch.id, {
        title: ch.title,
        videoUrl: ch.videoUrl,
        sortOrder: ch.sortOrder,
      })
      setChapters((list) => list.map((c) => (c.id === ch.id ? { ...c, ...updated } : c)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi lưu")
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={`Chương học — ${code}`}
        subtitle={readOnly ? "Chế độ xem" : undefined}
        actions={
          <Link to="/admin/courses" className="text-sm text-drive-action">
            ← Khóa học
          </Link>
        }
      />
      {error ? <p className="text-drive-danger">{error}</p> : null}
      <ul className="space-y-4">
        {chapters.map((ch, idx) => (
          <UiCard key={ch.id} variant="panel">
            <TextField
              label={`Chương ${idx + 1}`}
              value={ch.title ?? ""}
              disabled={readOnly}
              onChange={(e) =>
                setChapters((list) =>
                  list.map((c) => (c.id === ch.id ? { ...c, title: e.target.value } : c)),
                )
              }
            />
            <TextField
              className="mt-3"
              label="Video URL (YouTube)"
              value={ch.videoUrl ?? ""}
              disabled={readOnly}
              onChange={(e) =>
                setChapters((list) =>
                  list.map((c) => (c.id === ch.id ? { ...c, videoUrl: e.target.value } : c)),
                )
              }
            />
            {!readOnly ? (
              <PrimaryButton className="mt-3" onClick={() => saveChapter(ch)}>
                Lưu chương
              </PrimaryButton>
            ) : null}
          </UiCard>
        ))}
      </ul>
    </section>
  )
}
