import { Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "./components/AppShell.jsx"
import { PageFallback } from "./components/PageFallback.jsx"
import { RouteLayout } from "./components/RouteLayout.jsx"
import { routeConfig } from "./routes.jsx"

function LazyRoute({ layout, LazyPage }) {
  return (
    <RouteLayout layout={layout}>
      <LazyPage />
    </RouteLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/home" element={<Navigate to="/" replace />} />
            {routeConfig.map(({ path, layout, LazyPage }) => (
              <Route
                key={path}
                path={path}
                element={<LazyRoute layout={layout} LazyPage={LazyPage} />}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}
