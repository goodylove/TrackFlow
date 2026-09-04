import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"


import { Hero } from "@/components/marketing/hero"
import { LandingSections } from "@/components/marketing/landing-sections"
import { Navbar } from "@/components/marketing/navbar"
import { Seo } from "@/components/shared/seo"
import { ProtectedRoute, PublicOnlyRoute } from "@/feature/auth/auth-route-guard"
import AuthPage from "./pages/auth/auth.page"

const DashboardPage = lazy(() => import("./pages/dashboard/dashboard.page"))
const DashboardLayout = lazy(() => import("./pages/dashboard/dashboard-layout"))
const IssuesPage = lazy(() => import("./pages/issues/issues.page"))
const WorkspaceMembersPage = lazy(() => import("./pages/members/workspace-members.page"))
const WorkspaceSettingsPage = lazy(() => import("./pages/settings/workspace-settings.page"))
const WorkspacesPage = lazy(() => import("./pages/workspace/workspaces.page"))

function LandingPage() {
  return (
    <>
      <Seo
        description="TrackFlow gives focused teams one place to organize issues, assign clear ownership, and keep work moving forward."
        keywords="issue tracking, project management, team collaboration, issue workflow"
        title="Issue tracking for focused teams"
      />
      <div className="min-h-screen px-0 py-0 text-[var(--foreground)] sm:px-6 sm:py-4">
        <div className="mx-auto min-h-screen w-full max-w-[var(--landing-canvas-width)] overflow-hidden ">
          <Navbar />

          <main>
            <Hero />
            <LandingSections />
          </main>
        </div>
      </div>
    </>
  )
}

function AuthRoute({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup"

  return (
    <>
      <Seo
        description={
          isSignup
            ? "Create a TrackFlow account to organize issues and collaborate with your team."
            : "Sign in to TrackFlow to continue managing your team's issues and workflow."
        }
        noIndex
        title={isSignup ? "Create an account" : "Sign in"}
      />
      <AuthPage key={mode} mode={mode} />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><AuthRoute mode="login" /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><AuthRoute mode="signup" /></PublicOnlyRoute>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div className="grid min-h-screen place-items-center bg-background text-sm font-bold text-muted-foreground">Loading dashboard...</div>}>
              <DashboardLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="issues" element={<IssuesPage />} />
        <Route path="members" element={<WorkspaceMembersPage />} />
        <Route path="settings" element={<WorkspaceSettingsPage />} />
        <Route path="workspace" element={<WorkspacesPage />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
