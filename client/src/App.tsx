import { Navigate, Route, Routes } from "react-router-dom"


import { Hero } from "@/components/marketing/hero"
import { LandingSections } from "@/components/marketing/landing-sections"
import { Navbar } from "@/components/marketing/navbar"
import { Seo } from "@/components/shared/seo"
import AuthPage from "./pages/auth/auth.page"

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
      <Route path="/login" element={<AuthRoute mode="login" />} />
      <Route path="/signup" element={<AuthRoute mode="signup" />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
